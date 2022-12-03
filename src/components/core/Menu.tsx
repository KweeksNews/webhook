import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Menu as MenuBar, X } from 'react-feather';

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
      <button
        className="menu"
        aria-label="Menu"
        onClick={(event) => {
          setToggled(!toggled);
          event.stopPropagation();
        }}
      >
        <X
          className={`absolute transition-all duration-100 ${
            toggled ? 'delay-100 visible rotate-0' : 'invisible rotate-90'
          }`}
        />
        <MenuBar
          className={`absolute transition-all duration-100 ${
            !toggled ? 'delay-100 visible rotate-0' : 'invisible -rotate-90'
          }`}
        />
      </button>

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
