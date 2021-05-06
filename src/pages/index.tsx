import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../services/api'

import styles from '../styles/index.module.scss'

type HomeProps = {
  films: Array<Object>
}

export default function Home({films}: HomeProps) {

  const [filmList, setFilmList] = useState([])

  useEffect( () => {

    setFilmList(films)

  },[])

  return (
    <div className={styles.mainContainer}>

      <Head>
        <title>Filmes</title>
      </Head>

      <div className={styles.top}>
        <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
      </div>
      <div className={styles.bot} >
        {filmList.map( (p, index) => (
          <Link href={`films/${index + 1}`} key={index} >
            <button key={index}>
              {p.title}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () =>{
  const { data } = await api.get('/films')

  const { results } = data

  const films = results.map(ep => {

    return {
      title: ep.title,
    }
  })

  return{
    props: {
      films
    },
    revalidate: 60 * 60 * 23,
  }

}
