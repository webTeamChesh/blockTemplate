const listTemplate = `
  <div id="contentTypesContainer">
  <h1>{{h1}}</h1>
  <div class="row events-container">
    <div class="col-lg-8">
      <nav
        v-if="pageCount > 1"
        role="navigation"
        aria-label="Results data navigation"
      >
        <ul class="pagination d-flex flex-wrap mb-2 ms-0">
          <li class="page-item" v-bind:class="{disabled: pageIndex===0}">
            <button
              class="page-link"
              type="button"
              v-on:click="goToPage(pageIndex - 1)"
            >
              Previous
            </button>
          </li>
          <li
            v-for="(pageBtn, i) in pageBtns"
            class="page-item"
            v-bind:class="{disabled: pageIndex===i}"
            v-bind:key="pageBtn"
          >
            <button class="page-link" type="button" v-on:click="goToPage(i)">
              {{pageBtn}}
            </button>
          </li>
          <li
            class="page-item"
            v-bind:class="{disabled: pageIndex + 1 >=pageCount}"
          >
            <button
              class="page-link"
              type="button"
              v-on:click="goToPage(pageIndex + 1)"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <div class="api-results-info">
        <p>Total results: <strong>{{totalCount}}</strong></p>
        <p class="d-block" v-if="!totalCount">
          Try clearing filters and/or searches.
        </p>
        <p v-if="pageCount > 1">
          Current page: <strong>{{pageIndex + 1}}</strong>
        </p>
      </div>
      <div v-for="(_, i) in pages" :key="i" v-show="i===pageIndex">
        <ul>
          <li
            v-for="item in pages[i]"
            v-bind:key="item.sys.id"
          >{{item.entryTitle}}
          </li>
        </ul>
      </div>
      <nav
        v-if="pageCount > 1"
        role="navigation"
        aria-label="Results data navigation"
      >
        <ul class="pagination d-flex flex-wrap mb-2 ms-0">
          <li class="page-item" v-bind:class="{disabled: pageIndex===0}">
            <button
              class="page-link"
              type="button"
              v-on:click="goToPage(pageIndex)"
            >
              Previous
            </button>
          </li>
          <li
            v-for="(pageBtn, i) in pageBtns"
            class="page-item"
            v-bind:class="{disabled: pageIndex===i}"
            v-bind:key="pageBtn"
          >
            <button class="page-link" type="button" v-on:click="goToPage(i)">
              {{pageBtn}}
            </button>
          </li>
          <li
            class="page-item"
            v-bind:class="{disabled: pageIndex + 1 >=pageCount}"
          >
            <button
              class="page-link"
              type="button"
              v-on:click="goToPage(pageIndex + 1)"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</div>
  `;

export default listTemplate;
