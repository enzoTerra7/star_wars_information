import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

type HomeProps = {
    starship: {
        name: string,
        height: string,
        mass: string,
        hair_color: string,
        skin_color: string,
        eye_color: string,
        birth_year: string,
        gender: string,
        movies: Array<string>,
        species: Array<string>,
        vehicles: Array<string>,
        starships: Array<string>
    }
}

export default function Starship ({starship}: HomeProps) {

    const details = [
        {
            id: 'height',
            value: starship.height
        },
        {
            id: 'mass',
            value: starship.mass
        },
        {
            id: 'hair_color',
            value: starship.hair_color
        },
        {
            id: 'skin_color',
            value: starship.skin_color
        },
        {
            id: 'eye_color',
            value: starship.eye_color
        },
        {
            id: 'birth_year',
            value: starship.birth_year
        },
        {
            id: 'gender',
            value: starship.gender
        }
    ]

    const [movie, setMovie] = useState([])

    const movies = starship.movies

    const [specie, setSpecie] = useState([])

    const species = starship.species

    const [vehicle, setVehicle] = useState([])

    const vehicles = starship.vehicles

    const [starships, setStarships] = useState([])

    const naves = starship.starships

    const howIsThePerson = async () => {
        await movies.forEach(async element => {
            let { data } = await axios.get(`${element}`)
            let newUrl = data.url.slice(20)
            setMovie((p) => [...p, {title: data.title, url: newUrl}] )
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
    } 

    useEffect( () => {
        setVehicle([])
        setStarships([])
        setSpecie([])
        setMovie([])
        howIsThePerson()
    },[movies])

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Personagem | {starship.name} </title>
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
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.title}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Tem as naves:</h2>
                <div className={styles.movies}>
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
                <h2>Tem os veiculos:</h2>
                <div className={styles.movies}>
                    {vehicle.length <= 0 && (
                        <button>
                            Sem veiculos identificados
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
                <h2>Da especie:</h2>
                <div className={styles.movies}>
                    {specie.length <= 0 && (
                        <button>
                            Sem especie identificada
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
            </div>
        </div>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('/people')

    const person = data.results

    const paths = person.map( e => {
        return {
            params: {
                slug: e.name,
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
    
    const { data } = await api.get(`/people/${slug}/`)

    const starship = {
        name: data.name,
        height: data.height,
        mass: data.mass,
        hair_color: data.hair_color,
        skin_color: data.skin_color,
        eye_color: data.eye_color,
        birth_year: data.birth_year,
        gender: data.gender,
        movies: data.films,
        species: data.species,
        starships: data.starships,
        vehicles: data.vehicles,
    }
    
    return{
        props: {
            starship
        },
        revalidate: 60 * 60 * 24,
    }
}