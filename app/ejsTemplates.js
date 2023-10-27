'use strict';

const appInner = `
        return createSSRApp({
          data: () => ({
          h1: title,
          pages: pages,
          copyItems: items,
          pageIndex: 0,
          totalCount: items.length,
          pageSize: pageSize,
          pageCount: btns.length,
          pageBtns: btns,
        }),
        methods: {
          clearAlert: function () {
            this.searchAlert = false;
          },
          searchFilter: function () {
            let fromDate = this.fromDate.length > 0 ? new Date(this.fromDate) : false;
            let toDate = this.toDate.length > 0 ? new Date(this.toDate) : false;
            this.searchedItems = this.filteredItems.filter((item) =>
              this.searchFields.some((term) => {
                return (
                  (!this.searchTerm ||
                    item[term]
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())) &&
                  (!fromDate || item.dateStartEnd.to > fromDate) &&
                  (!toDate || item.dateStartEnd.to < toDate)
                );
              }),
            );
            this.searchedItems.sort(this.sortDate);
            this.calculatePages();
          },
          filterByCategories: function () {
            if (this.categoriesChecked.length === 0) {
              this.filteredItems = this.copyItems.slice();
            } else {
              this.filteredItems = this.copyItems.filter((elem) =>
                this.categoriesChecked.every(c => elem[this.filterField].includes(c)));
            }
            this.searchFilter();
          },
          resetSearch: function () {
            this.categoriesChecked = [];
            this.categories.forEach(
              (e) => (document.getElementById(e).checked = false)
            );
            this.searchTerm = '';
            this.fromDate = '';
            this.toDate = '';
            this.searchedItems = this.copyItems.slice();
            this.calculatePages();
            },
            calculatePages: function () {
              this.totalCount = this.searchedItems.length;
              this.pageCount = Math.ceil(this.totalCount / this.pageSize);
              this.pageIndex = 0;
              this.pageBtns = Array.from({ length: this.pageCount }, (_, i) => i + 1);
              this.createPages();
              this.items = this.pages[0];
              if (this.loaded) {
                document.getElementById('contentTypesContainer').scrollIntoView();
              } else {
                this.loaded = true;
              }
            },
            createPages: function () {
            this.pages = [
              ...Array(Math.ceil(this.searchedItems.length / this.pageSize)),
            ].map(() => this.searchedItems.splice(0, this.pageSize));
          },
          goToPage: function (i) {
            document.getElementById('contentTypesContainer').scrollIntoView();
            this.pageIndex = i;
            this.lastSearch = this.searchTerm;
          },
          applyFilters: function (cat) {
            const index = this.categoriesChecked.indexOf(cat);
            if (index > -1) {
              this.categoriesChecked.splice(index, 1);
            } else {
              this.categoriesChecked.push(cat);
            }
            this.filterByCategories();
            this.searchFilter();
          },
        },
        mounted() {
          this.filteredItems = this.copyItems.slice();
          this.searchedItems = this.copyItems.slice();
          this.calculatePages();
        },
          template: \`<%- template %>\`,
        })
  `;


const appOuter = `
  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js"
      }
    }
  </script>
  <script type="module">
      import { createSSRApp } from 'vue';
      function createApp(items, title, pages, btns, pageSize) {
        <%- appBody %>
      }
      createApp(<%- JSON.stringify(items) %>, <%- JSON.stringify(title) %>, <%- JSON.stringify(pages) %>, <%- JSON.stringify(btns) %>, <%= pageSize %>).mount('#app');
</script>
`;

export { appOuter, appInner};
