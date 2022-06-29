import React from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { getInvoices } from "../../data/bookkeepingData";
import QueryNavLink from "../components/QueryNavLink";

export default function Invoices() {
  let invoices = getInvoices();
  let [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (event) => {
    let filter = event.target.value;
    if (filter) {
      setSearchParams({ company: filter });
    } else {
      setSearchParams({});
    }
  };

  const filterCompanyBySearchParam = (invoice) => {
    /**
     * Grab the value of the `company` searchParam
     */
    let companySearchValue = searchParams.get("company");

    /**
     * Base case: no filter; show all invoices
     */
    if (!companySearchValue) {
      return true;
    }

    /**
     * Filter case: input filter against `companySearchValue`
     * Bring parity to `companySearchVal` and filter
     * Lowercase all `companySearchVal`s to match lowercased filter
     * Returns boolean for filter function using `.startsWith`
     */

    let lowercaseSearchVal = companySearchValue.toLowerCase();
    let lowercaseCompany = invoice.company.toLowerCase();

    return lowercaseCompany.startsWith(lowercaseSearchVal);
  };

  const ActivatedLink = ({ number, company }) => (
    <QueryNavLink
      style={({ isActive }) => {
        return {
          display: "block",
          margin: "1rem 0",
          color: isActive ? "deeppink" : "",
          fontStyle: isActive ? "italic" : "",
        };
      }}
      baseRoute={`/invoices/${number}`}
      key={number}
    >
      {company}
    </QueryNavLink>
  );

  return (
    <div style={{ display: "flex" }}>
      <nav style={{ borderRight: "solid 1px", padding: "1rem" }}>
        <input
          placeholder="Search for an invoice here..."
          className="form-control"
          onChange={handleSearch}
        />

        {invoices.filter(filterCompanyBySearchParam).map(ActivatedLink)}
      </nav>
      <Outlet />
    </div>
  );
}

// INLINE CALLBACK VERSION: 35 lines
//   {invoices
//    .filter((invoice) => {
//      let filter = searchParams.get("company");
//      /**
//       * Base case: no filter; show all invoices
//       */
//      if (!filter) return true;
//      /**
//       * Filter case: input filter against company name
//       * Bring parity to company name and filter
//       * Lowercase all company names to match lowercased filter
//       * Returns boolean for filter function using `.startsWith`
//       */
//      let lowercaseCompany = invoice.company.toLowerCase();
//      let lowercaseFilter = filter.toLowerCase();
//      return lowercaseCompany.startsWith(lowercaseFilter);
//    })
//    .map(({ number, company }) => (
//      <NavLink
//        style={({ isActive }) => {
//          return {
//            display: "block",
//            margin: "1rem 0",
//            color: isActive ? "deeppink" : "",
//            fontStyle: isActive ? "italic" : "",
//          };
//        }}
//        to={`/invoices/${number}`}
//        key={number}
//      >
//        {company}
//      </NavLink>
//    ))}
