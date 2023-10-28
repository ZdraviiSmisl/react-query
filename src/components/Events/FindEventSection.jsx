import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchEvents } from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";
import EventItem from "./EventItem";

export default function FindEventSection() {
  //Since  chainging value from ref doesn't couse revaluating of the component I use "state" here. Thus i can  store the inserted value only after submitting the form
  const searchElement = useRef();
  //here I define an initial state as undefinde in oder not to be seen any events initially. All events will be seen only after the user clereas the input field
  const [searchTerm, setSearchTerm] = useState();
  //is Pendgin differes from isLOading is that isLOading will not be true  if the query is disabled
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    enabled: searchTerm !== undefined, //I do so because i dont feel up to trigger this query along with fetching all events
  });

  function handleSubmit(event) {
    event.preventDefault();

    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error accure"
        message={error.info?.message || "Failed to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
