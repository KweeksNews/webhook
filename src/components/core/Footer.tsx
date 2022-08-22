export function Footer() {
  return (
    <footer className="px-6 py-4 bg-black">
      <p className="text-xs text-center text-white">
        &copy; {new Date().getFullYear()}{' '}
        <span className="link inline-block text-tigers-eye" tabIndex={0}>
          KweeksNews Network
        </span>
        . All Rights Reserved.
      </p>
    </footer>
  );
}
