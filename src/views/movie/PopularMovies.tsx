import Container from '@app/components/common/Container';
import PaginationBar from '@app/components/common/PaginationBar';
import withLoader from '@app/components/hoc/withLoader';
import MovieList from '@app/components/movies/MovieList';
import { numberWithCommas } from '@app/helpers/helperFunctions';
import useDocumentTitle from '@app/hooks/useDocumentTitle';
import usePageSaver from '@app/hooks/usePageSaver';
import { fetchPopularMovies } from '@app/redux/actions/movieActions';
import { IRootState } from '@app/types/types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PopularMovies = () => {
  const { popularMovies, isLoading } = useSelector((state: IRootState) => ({
    popularMovies: state.movies.popular,
    isLoading: state.misc.isLoading,
  }));
  const { currentPage, setCurrentPage } = usePageSaver();
  const dispatch = useDispatch();
  const route = '/movie/popular';

  useDocumentTitle('Popular Movies | MOVX');
  useEffect(() => {
    if (!popularMovies) {
      console.log(currentPage)
      dispatch(fetchPopularMovies(route, currentPage));
    }
  }, []);

  const handlePageChange = (page: number) => {
    if (popularMovies?.page !== page && !isLoading) {
      dispatch(fetchPopularMovies(route, page));
      setCurrentPage(page)
    }
  };

  return (
    <Container>
      <div className="movie__header">
        <div className="movie__header-title">
          <h1>Popular Movies</h1>
          <h3>{numberWithCommas(popularMovies?.total_results || 0)} Movies</h3>
        </div>
      </div>
      <MovieList
        movies={popularMovies?.results || []}
        templateCount={10}
      />
      {popularMovies && (
        <PaginationBar
          activePage={popularMovies.page}
          itemsCountPerPage={1}
          onChange={handlePageChange}
          pageRangeDisplayed={10}
          totalItemsCount={popularMovies.total_pages}
          totalPage={popularMovies.total_pages}
        />
      )}
    </Container>
  );
};

export default withLoader('popularMovies')(PopularMovies);