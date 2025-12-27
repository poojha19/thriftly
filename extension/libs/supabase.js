// Supabase client v2 bundled for Chrome extension
// This is a minimal implementation - for production use the full library

(function() {
  'use strict';

  class SupabaseClient {
    constructor(url, key) {
      this.url = url;
      this.key = key;
      this.headers = {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      };
    }

    from(table) {
      return new SupabaseQueryBuilder(this.url, this.headers, table);
    }
  }

  class SupabaseQueryBuilder {
    constructor(url, headers, table) {
      this.url = `${url}/rest/v1/${table}`;
      this.headers = headers;
      this.query = '';
      this.filters = [];
    }

    select(columns = '*') {
      this.query = `?select=${columns}`;
      return this;
    }

    eq(column, value) {
      this.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
      return this;
    }

    order(column, { ascending = true } = {}) {
      const separator = this.query.includes('?') ? '&' : '?';
      this.query += `${separator}order=${column}.${ascending ? 'asc' : 'desc'}`;
      return this;
    }

    async execute() {
      let url = this.url + this.query;
      if (this.filters.length > 0) {
        const filterString = this.filters.join('&');
        url += this.query.includes('?') ? '&' + filterString : '?' + filterString;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(errorText || 'Request failed');
      }
      
      const text = await response.text();
      if (!text) {
        return { data: [], error: null };
      }
      
      try {
        return { data: JSON.parse(text), error: null };
      } catch (e) {
        console.error('JSON parse error:', text);
        throw new Error('Invalid JSON response');
      }
    }

    async upsert(data, options = {}) {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Prefer': options.onConflict ? `resolution=${options.onConflict === 'item_id' ? 'merge-duplicates' : 'ignore'}` : ''
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upsert error:', errorText);
        throw new Error(errorText || 'Request failed');
      }
      
      const text = await response.text();
      if (!text) {
        return { data: [], error: null };
      }
      
      try {
        return { data: JSON.parse(text), error: null };
      } catch (e) {
        console.error('JSON parse error in upsert:', text);
        throw new Error('Invalid JSON response');
      }
    }
  }

  // Export for global use
  if (typeof window !== 'undefined') {
    window.supabase = { createClient: (url, key) => new SupabaseClient(url, key) };
  }

})();
