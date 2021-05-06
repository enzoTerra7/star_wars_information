import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";

import { useEffect, useState } from "react";

import axios from "axios";
import Link from "next/link";

type EpisodeObject = {
    episode: {
        title: string,
        characters: Array<string>,
        sinopse: string,
        id: number,
        director: string,
        producer: string,
        date: string,
        species: Array<string>,
        vehicles: Array<string>,
        starships: Array<string>,
        planets: Array<string>
    };
}

export default function filmes ({episode}: EpisodeObject) {

    const persons = episode.characters

    const [characters, setCharacters] = useState([])

    const currencyDate = episode.date.split('-')

    const [year, mounth, day] = currencyDate

    const ptBrDate = `${day} - ${mounth} - ${year}`

    const [specie, setSpecie] = useState([])

    const species = episode.species

    const [vehicle, setVehicle] = useState([])

    const vehicles = episode.vehicles

    const [starships, setStarships] = useState([])

    const naves = episode.starships

    const [planet, setPlanet] = useState([])

    const planets = episode.planets

    const howIsThePerson = async () => {
        await persons.forEach(async element => {
            let { data } = await axios.get(`${element}`)
            let newUrl = data.url.slice(20)
            setCharacters((p) => [...p, {name: data.name, url: newUrl}] )
        });
        if(species.length > 0) {
            await species.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                
                setSpecie((p) => [...p, {name: data.name, url: newUrl}] )
            });
        }
        if(vehicles.length > 0) {
            await vehicles.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                
                setVehicle((p) => [...p, {name: data.name, url: newUrl}] )
            });
        }
        if(naves.length > 0) {
            await naves.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                
                setStarships((p) => [...p, {name: data.name, url: newUrl}] )
            });
        }
        if(planets.length > 0) {
            await planets.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                
                setPlanet((p) => [...p, {name: data.name, url: newUrl}] )
            });
        }
    }

    useEffect( () => {
        setSpecie([])
        setVehicle([])
        setStarships([])
        setPlanet([])
        setCharacters([])
        howIsThePerson()
    },[persons])

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Filme | {episode.title} </title>
            </Head>

            <div className={styles.top}>
                <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
            </div>

            <div className={styles.middle}>
                <h1>{episode.title}</h1>
            </div>

            <div className={styles.bot} >
                <h2>Personagens:</h2>
                <div>
                    {characters.map( (p, index) => (
                        <Link href={`${p.url}`} key={index}>
                            <button >
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Naves:</h2>
                <div>
                    {starships.length <= 0 && (
                        <button>
                            Sem naves identificada
                        </button>
                    )}
                    {starships.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Espécies:</h2>
                <div>
                    {specie.length <= 0 && (
                        <button>
                            Sem espécies identificadas
                        </button>
                    )}
                    {specie.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Veículos:</h2>
                <div>
                    {vehicle.length <= 0 && (
                        <button>
                            Sem veículos identificados
                        </button>
                    )}
                    {vehicle.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Planetas:</h2>
                <div>
                    {planet.length <= 0 && (
                        <button>
                            Sem planetas identificados
                        </button>
                    )}
                    {planet.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles.sinopse}>
                <h2>Sinopse: <small>{episode.title}</small></h2>
                <span>Episodio {episode.id}</span>
                {episode.sinopse}
                <div className={styles.data}>
                    <strong>Dados importantes</strong>
                    <ul>
                        <li>
                            Diretor: {episode.director};
                        </li>
                        <li>
                            Produtor: {episode.producer};
                        </li>
                        <li>
                            Data de lançamento: {ptBrDate};
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('films/')

    const filmes = data.results

    const paths = filmes.map( e => {
        return {
            params: {
                slug: e.title
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
    
    const { data } = await api.get(`/films/${slug}`)

    const episode = {
        title: data.title,
        characters: data.characters,
        sinopse: data.opening_crawl,
        id: data.episode_id,
        director: data.director,
        producer: data.producer,
        date: data.release_date,
        species: data.species,
        starships: data.starships,
        vehicles: data.vehicles,
        planets: data.planets,
    }
    
    return{
        props: {
            episode
        },
        revalidate: 60 * 60 * 24,
    }
}