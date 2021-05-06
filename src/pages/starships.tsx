import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import styles from '../styles/starships.module.scss'

type StarshipsProps = {
    starship: Array<Object>
}

export default function Starships ({starship}: StarshipsProps) {

    const [starshipsList, setStarshipsList] = useState([])

    useEffect( () => {

        setStarshipsList(starship)

    },[])

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Filme | Starships </title>
            </Head>

            <div className={styles.top}>
                <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
            </div>

            <div className={styles.middle}>
                <h1>Naves:</h1>
            </div>

            <div className={styles.bot} >
                <div>
                    {starshipsList.map( (p, index) => (
                        <Link href={`starships/${index + 1}`} key={index} >
                            <button key={index}>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () =>{
  const { data } = await api.get('/starships')

  const { results } = data

  const starship = results.map(ep => {

    return {
      name: ep.name,
    }
  })

  return{
    props: {
      starship
    },
    revalidate: 60 * 60 * 23,
  }

}