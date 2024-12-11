
// import { FaTelegram, FaXTwitter } from "react-icons/fa6";
import styles from "@/app/styles/menu.module.css";
import Image from "next/image";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

interface SocialTab {
    onItemClick: () => void;
}

const SocialTab: React.FC<SocialTab> = () => {



    return (
        <nav className={styles.nav}>
            <ul className={styles.menuList}>
                <li className={styles.socialIcons}>
                    <a
                        href="https://x.com/xxx"
                        target="_blank"
                        rel="noopener noreferrer"

                    >
                        <FaXTwitter />
                    </a>

                    <a
                        href="https://discord.gg/xxx"
                        target="_blank"
                        rel="noopener noreferrer"

                    >
                        <FaDiscord />
                    </a>
                    <a
                        href="https://magiceden.io/collections/apechain/xxx"
                        target="_blank"
                        rel="noopener noreferrer"

                        className="flex items-center"
                    >
                        <div className="w-[1em] h-[1em] relative">
                            <Image
                                src="/MagicEden.png"
                                alt="Magic Eden"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </a>

                </li>
            </ul>
        </nav>
    );
};

export default SocialTab;