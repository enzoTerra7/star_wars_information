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

    const hanldeCalcIndex = (index) => {

        index = parseInt(index)

        switch (index + 1) {
            case 1 :
                index = '2'
                break;

            case 2:
                index = '3'
                break;

            case 3:
                index = '5'
                break;

            case 4 :
                index = '9'
                break;

            case 5 :
                index = '10'
                break;

            case 6 :
                index = '11'
                break;

            case 7 :
                index = '12'
                break;

            case 8 :
                index = '13'
                break;

            case 9 :
                index = '15'
                break;

            case 10 :
                index = '17'
                break;
        
            default:
                break;
        }

        return index

    }

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
                        <Link href={`starships/${hanldeCalcIndex(index)}`} key={index} >
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