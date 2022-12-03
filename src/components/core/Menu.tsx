import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Squash as Hamburger } from 'hamburger-react';

type Props = {
  toggled: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>;
  navLinks?: {
    name: string;
    url: string;
  }[];
};

export function Menu({ toggled, setToggled, navLinks }: Props) {
  return (
    <>
      <Hamburger
        size={24}
        rounded={true}
        hideOutline={false}
        label="Menu"
        toggled={toggled}
        toggle={setToggled}
      />

      <aside
        aria-hidden={!toggled}
        tabIndex={toggled ? 1 : -1}
        className={`navmenu ${toggled ? 'open' : ''}`}
      >
        <ul className="w-28 mb-14 text-center">
          {navLinks &&
            navLinks.map(({ name, url }, i) => (
              <li key={i} className="my-2">
                <Link href={url} className="navlink">
                  {name}
                </Link>
              </li>
            ))}
        </ul>
      </aside>
    </>
  );
}
