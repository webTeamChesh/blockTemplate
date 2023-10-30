const listTemplate = `
  <div id="contentTypesContainer">
  <h2>{{h2}}</h2>
  <div class="row events-container">
          <div class="row">
            <div class="span4">
              <h3 ref="tableTop" class="fs-4">
                Search for a registered HMO
              </h3>
              <div class="search-options">
                <div class="col-lg-8">
                  <div  class="input-group mb-3 content-type-search border border-dark">
                    <input
                          @input="searchContentType"
                          @focus="clearAlert"
                          autocomplete="off"
                          type="text"
                          class="form-control"
                          placeholder="Type here..."
                          v-model="searchTerm"
                          aria-label="Search term"
                          id="contentTypeSearchInput"
                        />
                    <label for="contentTypeSearchInput" class="hidden"
                          >Search term</label>
                    <div class="input-group-append">
                      <button
                            type="button"
                            class="btn btn-outline-secondary"
                            v-on:click="callSearch"
                            id="contentTypeSearchBtn"
                          >
                            Search
                          </button>
                      <button
                            v-if="searchTerm.length > 0"
                            class="btn btn-outline-secondary"
                            type="button"
                            v-on:click="resetSearch"
                          >
                            Clear Search
                          </button>
                    </div>
                  </div>
                </div>
                <div  class="search-error-messages">
                  <div v-if="searchAlert" class="alert alert-secondary mt-2" role="alert">
                    Please enter a search term.
                  </div>
                </div>
              </div>
            </div>
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
    <div class="container">
      <p class="cec-green">Click on a heading to sort by that column.</p>
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
      <section v-for="(_, i) in pages" :key="i" v-show="i===pageIndex">
            <table class="table usr_TableDefault">
              <caption class="usr_CaptionHide">
                Register of HMO Licences
              </caption>
              <thead>
                <tr>
                  <th v-for="obj in fields" tabindex="0" scope="col" @click="sortByField(obj)" :id="obj.id" class="tableHead p-0 align-middle">
                    <div class="container ps-2">
                      <div class="row align-items-center">
                        <div class="col-11 pt-1">{{obj.display}}</div>
                        <div class="col-1 p-0">
                          <span class="hmoUpIcon" :id="'up' + obj.id"
                                >&#9650;</span>
                          <span class="hmoDownIcon" :id="'down' + obj.id"
                                >&#9660;</span>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in pages[i]">
                  <td>{{item.licenceReference}}</td>
                  <td>{{toTitleCase(item.buildingName)}}</td>
                  <td>{{toTitleCase(item.area)}}</td>
                  <td>{{item.postcode}}</td>
                  <td>{{item.expDate}}</td>
                </tr>
              </tbody>
            </table>
  </section>
          </div>
        </div>
      </div>
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
  `;

export default listTemplate;
