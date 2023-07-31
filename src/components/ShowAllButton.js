const ShowAllButton = ({ toggleShowAll, showAll }) => {
  return (
    <>
      <button onClick={toggleShowAll}>
        show {showAll ? 'important' : 'all'}
      </button>
    </>
  )
}

export default ShowAllButton