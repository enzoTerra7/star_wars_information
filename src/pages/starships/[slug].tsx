import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type StarshipProp = {
    starship: {
        name: string;
        model: string,
        corp: string,
        length: string,
        maxSpeed: string,
        class: string,
        passengers: string
        films: Array<string>,
        pilots: Array<string>
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

    const pilots = starship.films

    const [pilot, setPilot] = useState([])

    const howIsThePerson = async () => {
        await movies.forEach(async element => {
            let { data } = await axios.get(`${element}`)
            let newUrl = data.url.slice(20)
            setMovie((p) => [...p, {title: data.title, url: newUrl} ] )
        });
        if(pilots.length > 0){
            await pilots.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                setPilot((p) => [...p, {title: data.title, url: newUrl} ] )
            });
        }
    }

    useEffect( () => {
        setPilot([])
        setMovie([])
        howIsThePerson()
    },[movies])

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Nave | {starship.name}</title>
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
                        <Link href={p.url} key={index}>
                            <button>
                                {p.title}
                            </button>
                        </Link>
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
    
    const { data } = await api.get(`/starships/${slug}`)

    const starship = {
        name: data.name,
        model: data.model,
        corp: data.manufacturer,
        length: data.length,
        maxSpeed: data.max_atmosphering_speed,
        class: data.starship_class,
        passengers: data.passengers,
        films: data.films,
        pilots: data.pilots,
    }
    
    return{
        props: {
            starship
        },
        revalidate: 60 * 60 * 24,
    }
}