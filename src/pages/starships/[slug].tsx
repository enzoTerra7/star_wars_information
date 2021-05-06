import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";

type StarshipProp = {
    starship: {
        name: string;
        model: string,
        corp: string,
        length: string,
        maxSpeed: string,
        class: string,
        passengers: string
        films: Array<string>
    }
}

export default function Starship ({starship}: StarshipProp) {

    const details = [
        {
            id: 'model',
            value: starship.model
        },
        {
            id: 'corp',
            value: starship.corp
        },
        {
            id: 'length',
            value: starship.length
        },
        {
            id: 'maxSpeed',
            value: starship.maxSpeed
        },
        {
            id: 'class',
            value: starship.class
        },
        {
            id: 'passengers',
            value: starship.passengers
        },

    ]

    const movies = starship.films

    const [movie, setMovie] = useState([])

    const howIsThePerson = async () => {
        await movies.forEach(async element => {
            let { data } = await axios.get(`${element}`)
            setMovie((p) => [...p, data.title] )
        });
    }

    useEffect( () => {
        setMovie([])
        howIsThePerson()
    },[movies])

    console.log(movie)

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Naves</title>
            </Head>

            <div className={styles.top}>
                <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
            </div>

            <div className={styles.middle}>
                <h1>{starship.name}</h1>
            </div>

            <div className={styles.bot} >
                <h2>Detalhes:</h2>
                <div className={styles.details}>
                    {details.map( (p, index) => (
                        <button key={index}>
                            {p.id}: {p.value}
                        </button>
                    ))}
                </div>
                <h2>Apareceu nos filmes:</h2>
                <div className={styles.movies}>
                    {movie.map( (p, index) => (
                        <button key={index}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('/starships')

    const starship = data.results

    const paths = starship.map( e => {
        return {
            params: {
                slug: e.crew
            }
        }
    })

    return{
        paths,
        fallback: 'blocking',
    }
};

export const getStaticProps: GetStaticProps = async (ctx) => {

    let { slug } = ctx.params

    switch (slug) {
        case '1' :
            slug = '2'
            break;

        case '2':
            slug = '3'
            break;

        case '3':
            slug = '5'
            break;

        case '4' :
            slug = '9'
            break;

        case '5' :
            slug = '10'
            break;

        case '6' :
            slug = '11'
            break;

        case '7' :
            slug = '12'
            break;

        case '8' :
            slug = '13'
            break;

        case '9' :
            slug = '15'
            break;

        case '10' :
            slug = '17'
            break;
    
        default:
            break;
    }

    
    const { data } = await api.get(`/starships/${slug}`)

    const starship = {
        name: data.name,
        model: data.model,
        corp: data.manufacturer,
        length: data.length,
        maxSpeed: data.max_atmosphering_speed,
        class: data.starship_class,
        passengers: data.passengers,
        films: data.films
    }
    
    return{
        props: {
            starship
        },
        revalidate: 60 * 60 * 24,
    }
}