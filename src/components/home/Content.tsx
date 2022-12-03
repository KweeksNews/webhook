import Image from 'next/image';

type Props = {
  navLinks?: {
    name: string;
    url: string;
  }[];
};

export function Content({ navLinks }: Props) {
  return (
    <section className="min-h-screen max-w-5xl flex flex-col justify-center items-center mx-auto md:flex-row">
      <div className="md:flex-1 text-center">
        <Image
          className="mx-auto"
          src="/assets/images/kweekshook.svg"
          alt="KweeksHook"
          title="KweeksHook"
          width={294.55}
          height={45}
        />

        <p className="text-base text-white mt-5">Peladen Webhook</p>

        <nav className="hidden mx-auto mt-12 md:flex md:justify-center">
          <ul className="flex text-center">
            {navLinks &&
              navLinks.map(({ name, url }, i) => (
                <li key={i} className="mx-3">
                  <a className="button" target="_blank" href={url} rel="noreferrer">
                    {name}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <div className="md:flex-1">
        <div className="flex h-[350px] max-w-md items-center mx-auto mt-28 md:mt-0">
          <Image
            src="/assets/images/webhook.svg"
            alt="Webhook"
            width={888}
            height={710.80704}
            priority
          />
        </div>
      </div>
    </section>
  );
}
