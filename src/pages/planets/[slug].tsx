import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";

import { useEffect, useState } from "react";

import axios from "axios";
import Link from "next/link";

type EpisodeObject = {
    episode: {
        name: string,
        characters: Array<string>,
        movies: Array<string>,
        rotacao: string,
        orbit: string,
        diameter: string,
        climate: string,
        gravity: string,
        terrain: string,
        surface_water: string,
        population: string,
    };
}

export default function filmes ({episode}: EpisodeObject) {

    const details = [
        {
            id: 'rotacao',
            value: episode.rotacao
        },
        {
            id: 'orbit',
            value: episode.orbit
        },
        {
            id: 'diameter',
            value: episode.diameter
        },
        {
            id: 'climate',
            value: episode.climate
        },
        {
            id: 'gravity',
            value: episode.gravity
        },
        {
            id: 'terrain',
            value: episode.terrain
        },
        {
            id: 'surface_water',
            value: episode.surface_water
        },
        {
            id: 'population',
            value: episode.population
        }
    ]

    const [movie, setMovie] = useState([])

    const movies = episode.movies

    const persons = episode.characters

    const [characters, setCharacters] = useState([])

    const howIsThePerson = async () => {
        await movies.forEach(async element => {
            let { data } = await axios.get(`${element}`)
            let newUrl = data.url.slice(20)
            setMovie((p) => [...p, {title: data.title, url: newUrl}] )
        });
        if(persons.length > 0) {
            await persons.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                setCharacters((p) => [...p, {name: data.name, url: newUrl}] )
            });
        }
    }

    useEffect( () => {
        setCharacters([])
        setMovie([])
        howIsThePerson()
    },[persons])

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Planeta | {episode.name} </title>
            </Head>

            <div className={styles.top}>
                <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
            </div>

            <div className={styles.middle}>
                <h1>{episode.name}</h1>
            </div>

            <div className={styles.bot} >
                <h2>Detalhes:</h2>
                <div>
                    {details.map( (p, index) => (
                        <button className={styles.details} key={index}>
                            {p.id}: {p.value}
                        </button>
                    ))}
                </div>
                <h2>Personagens:</h2>
                <div>
                    {characters.length <= 0 && (
                        <button >
                            Sem moradores
                        </button>
                    )}
                    {characters.map( (p, index) => (
                        <Link href={`${p.url}`} key={index}>
                            <button >
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Apareceu nos filmes:</h2>
                <div>
                    {movie.map( (p, index) => (
                        <Link href={`${p.url}`} key={index}>
                            <button >
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

    const { data } = await api.get('planets/')

    const filmes = data.results

    const paths = filmes.map( e => {
        return {
            params: {
                slug: e.name
            }
        }
    })

    return{
        paths,
        fallback: 'blocking',
    }
};

export const getStaticProps: GetStaticProps = async (ctx) => {

    const { slug } = ctx.params
    
    const { data } = await api.get(`/planets/${slug}`)

    const episode = {
        name: data.name,
        characters: data.residents,
        movies: data.films,
        rotacao: data.rotation_period,
        orbit: data.orbital_period,
        diameter: data.diameter,
        climate: data.climate,
        gravity: data.gravity,
        terrain: data.terrain,
        surface_water: data.surface_water,
        population: data.population,
    }
    
    return{
        props: {
            episode
        },
        revalidate: 60 * 60 * 24,
    }
}