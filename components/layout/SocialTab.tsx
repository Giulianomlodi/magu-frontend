
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
                        href="https://x.com/other_italy"
                        target="_blank"
                        rel="noopener noreferrer"

                    >
                        <FaXTwitter />
                    </a>

                    <a
                        href="https://discord.gg/bE5qZNngw8"
                        target="_blank"
                        rel="noopener noreferrer"

                    >
                        <FaDiscord />
                    </a>
                    <a
                        href="https://magiceden.io/collections/apechain/0x670c153118026660dc3bf93da7d80cf8107eb954"
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