import React, { useEffect, useState, useMemo } from "react";
import ProductDisplay from "./ProductDisplay";
import { StoreFilter } from "./StoreFilter";
import { Pagination } from "./Pagination";

let PageSize = 10;

export default function Store({ isInventoryLoaded, inventory, dispatch }) {
  // filtering
  const [filter, setFilter] = useState({});
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  useEffect(
    function filterInventoryDisplay() {
      let filterExists = false;
      // check if non-empty string exists on filter
      for (const subFilter of Object.values(filter)) {
        if (subFilter !== "") {
          filterExists = true;
        }
      }

      let newFilteredInventory = inventory;
      if (filterExists) {
        newFilteredInventory = inventory.filter((product) => {
          for (const property in filter) {
            if (filter[property]) {
              return product[property].includes(filter[property]);
            }
          }
        });
      }
      setFilteredInventory(newFilteredInventory);
    },
    [isInventoryLoaded, filter]
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredInventory.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredInventory]);

  return (
    <section>
      <div className='store-header'>
        <h1>Pokemon for sell</h1>
      </div>
      <h2>current page: {currentPage}</h2>
      <div className='store-display'>
        <StoreFilter filter={filter} setFilter={setFilter} />
        <ul className='products-display'>
          {(!isInventoryLoaded && <p>loading...</p>) ||
            (isInventoryLoaded &&
              filteredInventory.length > 0 &&
              currentPageData.map((product) => (
                <ProductDisplay
                  key={product.id}
                  product={product}
                  dispatch={dispatch}
                />
              ))) || (
              <p>Pokemon of specified filter(s) currently unavailable.</p>
            )}
        </ul>
        <Pagination
          className='pagination-bar'
          currentPage={currentPage}
          totalCount={filteredInventory.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  );
}
