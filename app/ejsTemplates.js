const breadcrumb = `
  <div class="cec-breadcrumb-bg">
      <div class="container">
        <div class="row">
          <div class="col">
            <nav class="no-print-url" aria-label="breadcrumb">
              </ol>
              <ol class="breadcrumb cec-breadcrumb my-0 py-2">
               <%- bc_inner %>
            </nav>
          </div>
        </div>
      </div>
    </div>`;

const appInner = `
return createSSRApp({
  data: () => ({
    h2: title,
    pages: pages,
    copyItems: items,
    pageIndex: 0,
    totalCount: items.length,
    pageSize: pageSize,
    pageCount: btns.length,
    pageBtns: btns,
    searchTerm: '',
    searchFields: [
      'postcode',
      'licenceReference',
      'buildingName',
      'area',
    ],
    numOfPaginationBtns: 0, // Set to 0 to show all.
    items: [],
    ordering: 'licenceReference',
    currentPageIndex: 0,
    searchAlert: false,
    lastSearch: '',
    searchedItems: [],
    fields: [
      {
        id: 'licenceReference',
        display: 'Licence reference',
        sort: 'sortHMO',
      },
      {
        id: 'buildingName',
        display: 'Building name or number and street',
        sort: 'sortByBld',
      },
      { id: 'area', display: 'Area', sort: 'sortStr' },
      { id: 'postcode', display: 'Postcode', sort: 'sortStr' },
      {
        id: 'expiryDate',
        display: 'Licence expiry date',
        sort: 'sortByNum',
      },
    ],
    numRx: /^-?[0-9]\d*(\.\d+)?/,
        }),
        methods: {
         toTitleCase: function (str) {
           let temp = str.split(' ');
           temp = temp.map(e =>  {
           return e ? e[0].toUpperCase() + e.slice(1).toLowerCase() : '';
           });
           return temp.join(' ');
          },
          searchFilter: function () {
            this.searchedItems =
              this.searchTerm === ''
                ? this.copyItems.slice()
                : this.copyItems.filter((item) =>
                    this.searchFields.some((term) =>
                      item[term]
                        .toLowerCase()
                        .includes(this.searchTerm.toLowerCase())
                    )
                  );
          },
          resetIcons: function () {
            this.fields.forEach((obj) => {
              obj.up.style.color = 'gray';
              obj.down.style.color = 'gray';
            });
          },
          sortByField: function (e) {
            this.resetIcons();
            let temp = [...this.pages[this.pageIndex]];
            temp.sort(this[e.sort](e.id));
            if (temp.some((e, i) => e.index !== this.pages[this.pageIndex][i].index)) {
              this.pages[this.pageIndex] = [...temp];
              e.up.style.color = 'black';
            } else {
              this.pages[this.pageIndex] = [...temp].reverse();
              e.down.style.color = 'black';
            }
          },
          toFloat: function (n) {
            let match = n.match(this.numRx);
            return match === null ? 0 : parseFloat(match);
          },
          sortByBld: function (f) {
            return (a, b) => {
              return this.toFloat(a[f]) - this.toFloat(b[f]);
            };
          },
          sortByNum: function (f) {
            return (a, b) => {
              return a[f] - b[f];
            };
          },
          sortStr: function (field) {
            return (a, b) => {
              let x = a[field].toLowerCase();
              let y = b[field].toLowerCase();
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            };
          },
          endDigits: function (str) {
            let temp = str.split('/');
            return parseInt(temp[temp.length - 1]);
          },
          sortHMO: function (field) {
            return (a, b) => {
              return (
                this.endDigits(a[field]) -
                this.endDigits(b[field])
              );
            };
          },
          clearAlert: function () {
            this.searchAlert = false;
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
          clearAlert: function () {
            this.searchAlert = false;
          },
          callSearch: function () {
            if (this.searchTerm.replace(/\s/g, '') == '') {
              this.resetSearch();
              this.searchAlert = true;
            } else {
              this.searchContentType();
            }
          },
          searchContentType: function () {
            this.lastSearch = this.searchTerm;
            this.searchAlert = false;
            this.searchFilter();
            this.calculatePages();
          },
          resetSearch: function () {
            this.searchTerm = '';
            this.searchedItems = this.copyItems.slice();
            this.calculatePages();
          },
          setUpHeaders: function (e) {
            e.up = document.getElementById('up' + e.id);
            e.down = document.getElementById('down' + e.id);
            e.elem.addEventListener('keydown', (ev) => {
              if (ev.code === 'Enter') {
                this.sortByField(e);
              }
            });
          },
        },
        mounted() {
          this.copyItems = this.copyItems.map(e => {
            e.expiryDate = new Date(e.expiryDate);
            return e;
          });
          this.fields.forEach((e) => {
            e.elem = document.getElementById(e.id);
            this.setUpHeaders(e);
          });
          let inputBox = document.getElementById('contentTypeSearchInput');
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

export { appOuter, appInner, breadcrumb };
