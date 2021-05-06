import styles from './styles.module.scss';

import Link from 'next/link'

export const Header = () => {
    return(
        <header className={styles.mainContainer}>
            <strong>
                star wars
            </strong>
            <ul>
                <li>
                    <Link href={`/`}> 
                        Filmes
                    </Link>
                </li>
                <li>
                    <Link href={`/starships`}> 
                        Naves
                    </Link>
                </li>
            </ul>
        </header>
    )
}