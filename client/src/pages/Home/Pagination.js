const Pagination = ({ pages, setPages }) => {
  const { totalPages } = pages;

  const handleClick = (e) => {
    setPages({
      ...pages,
      pageShowed: e.target.value,
    });
    console.log(e.target.value);
  };

  return (
    <>
      <h1>PAGE NUMBERS</h1>
      {[...Array(totalPages)].map((el, i) => (
        <button key={i} onClick={handleClick} value={i}>
          {i + 1}
        </button>
      ))}
    </>
  );
};

export default Pagination;
