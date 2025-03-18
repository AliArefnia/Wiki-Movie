<template>
  <HeaderSection />
  <main class="bg-surface-dark">
    <Hero></Hero>
    <TrailerSection />
    <BaseMovieSection
      v-for="genre in genres"
      :genreId="genre.id"
      :genreName="genre.name"
    />
  </main>
  <Footer />
</template>
<script setup>
import { useMovieStore } from "~/store/store";

const movieStore = useMovieStore();

const genres = movieStore.movieGenres;
</script>
<!-- 
genres : Array(19) 0 : {id: 28, name: 'Action'} 1 : {id: 12, name: 'Adventure'}
2 : {id: 16, name: 'Animation'} 3 : {id: 35, name: 'Comedy'} 4 : {id: 80, name:
'Crime'} 5 : {id: 99, name: 'Documentary'} 6 : {id: 18, name: 'Drama'} 7 : {id:
10751, name: 'Family'} 8 : {id: 14, name: 'Fantasy'} 9 : {id: 36, name:
'History'} 10 : {id: 27, name: 'Horror'} 11 : {id: 10402, name: 'Music'} 12 :
{id: 9648, name: 'Mystery'} 13 : {id: 10749, name: 'Romance'} 14 : {id: 878,
name: 'Science Fiction'} 15 : {id: 10770, name: 'TV Movie'} 16 : {id: 53, name:
'Thriller'} 17 : {id: 10752, name: 'War'} 18 : {id: 37, name: 'Western'} -->
