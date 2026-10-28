import { NextPage } from 'next';
import styles from './CookiePolicy.module.scss';

const CookiePolicy: NextPage = () => {
  return (
    <section className={styles.cookiePolicy}>
      <div className={styles.cookiePolicy__wrapper}>
        {/* HEADER */}
        <div className={styles.cookiePolicy__header}>
          <h1 className={styles.title}>Polityka cookie</h1>
        </div>

        {/* CONTENT */}
        <p className={styles.cookiePolicy__text}>
          1. Sklep nie zbiera w sposób automatyczny żadnych informacji, z
          wyjątkiem informacji zawartych w plikach cookies.
        </p>
        <p className={styles.cookiePolicy__text}>
          2. Pliki cookies (tak zwane „ciasteczka”) stanowią dane informatyczne,
          w szczególności pliki tekstowe, które przechowywane są w urządzeniu
          końcowym Użytkownika Sklepu i przeznaczone są do korzystania ze stron
          internetowych Sklepu. Cookies zazwyczaj zawierają nazwę strony
          internetowej, z której pochodzą, czas przechowywania ich na urządzeniu
          końcowym oraz unikalny numer.
        </p>
        <p className={styles.cookiePolicy__text}>
          3. Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika Sklepu
          pliki cookies oraz uzyskującym do nich dostęp jest operator Sklepu.
        </p>
        <p className={styles.cookiePolicy__text}>
          4. Pliki cookies wykorzystywane są w celu:
        </p>
        <p className={styles.cookiePolicy__text}>
          dostosowania zawartości stron internetowych Sklepu do preferencji
          Użytkownika oraz optymalizacji korzystania ze stron internetowych; w
          szczególności pliki te pozwalają rozpoznać urządzenie Użytkownika
          Sklepu i odpowiednio wyświetlić stronę internetową, dostosowaną do
          jego indywidualnych potrzeb;
        </p>
        <p className={styles.cookiePolicy__text}>
          tworzenia statystyk, które pomagają zrozumieć, w jaki sposób
          Użytkownicy Sklepu korzystają ze stron internetowych, co umożliwia
          ulepszanie ich struktury i zawartości;
        </p>
        <p className={styles.cookiePolicy__text}>
          5. W ramach Sklepu stosowane są dwa zasadnicze rodzaje plików cookies:
          „sesyjne” (session cookies) oraz „stałe” (persistent cookies). Cookies
          „sesyjne” są plikami tymczasowymi, które przechowywane są w urządzeniu
          końcowym Użytkownika do czasu opuszczenia strony internetowej lub
          wyłączenia oprogramowania (przeglądarki internetowej). „Stałe” pliki
          cookies przechowywane są w urządzeniu końcowym Użytkownika przez czas
          określony w parametrach plików cookies lub do czasu ich usunięcia
          przez Użytkownika.
        </p>
        <p className={styles.cookiePolicy__text}>
          6. W ramach Sklepu stosowane są następujące rodzaje plików cookies:
        </p>
        <p className={styles.cookiePolicy__text}>
          „niezbędne” pliki cookies, umożliwiające korzystanie z usług
          dostępnych w ramach Sklepu, np. uwierzytelniające pliki cookies
          wykorzystywane do usług wymagających uwierzytelniania w ramach Sklepu;
        </p>
        <p className={styles.cookiePolicy__text}>
          pliki cookies służące do zapewnienia bezpieczeństwa, na przykład
          wykorzystywane do wykrywania nadużyć w zakresie uwierzytelniania w
          ramach Sklepu;
        </p>
        <p className={styles.cookiePolicy__text}>
          „wydajnościowe” pliki cookies, umożliwiające zbieranie informacji o
          sposobie korzystania ze stron internetowych Sklepu;
        </p>
        <p className={styles.cookiePolicy__text}>
          „funkcjonalne” pliki cookies, umożliwiające „zapamiętanie” wybranych
          przez Użytkownika ustawień i personalizację interfejsu Użytkownika,
          np. w zakresie wybranego języka lub regionu, z którego pochodzi
          Użytkownik, rozmiaru czcionki, wyglądu strony internetowej itp.;
        </p>
        <p className={styles.cookiePolicy__text}>
          „reklamowe” pliki cookies, umożliwiające dostarczanie Użytkownikom
          treści reklamowych bardziej dostosowanych do ich zainteresowań.
        </p>
        <p className={styles.cookiePolicy__text}>
          7. W wielu przypadkach oprogramowanie służące do przeglądania stron
          internetowych (przeglądarka internetowa) domyślnie dopuszcza
          przechowywanie plików cookies w urządzeniu końcowym Użytkownika.
          Użytkownicy Sklepu mogą dokonać w każdym czasie zmiany ustawień
          dotyczących plików cookies. Ustawienia te mogą zostać zmienione w
          szczególności w taki sposób, aby blokować automatyczną obsługę plików
          cookies w ustawieniach przeglądarki internetowej bądź informować o ich
          każdorazowym zamieszczeniu w urządzeniu Użytkownika Sklepu.
          Szczegółowe informacje o możliwości i sposobach obsługi plików cookies
          dostępne są w ustawieniach oprogramowania (przeglądarki internetowej).
        </p>
        <p className={styles.cookiePolicy__text}>
          8. Operator Sklepu informuje, że ograniczenia stosowania plików
          cookies mogą wpłynąć na niektóre funkcjonalności dostępne na stronach
          internetowych Sklepu.
        </p>
        <p className={styles.cookiePolicy__text}>
          9. Pliki cookies zamieszczane w urządzeniu końcowym Użytkownika Sklepu
          i wykorzystywane mogą być również przez współpracujących z operatorem
          Sklepu reklamodawców oraz partnerów.
        </p>
        <p className={styles.cookiePolicy__text}>
          10. Więcej informacji na temat plików cookies dostępnych jest pod
          adresem{' '}
          <a
            href="https://wszystkoociasteczkach.pl"
            target="_blank"
            rel="noreferrer"
          >
            https://wszystkoociasteczkach.pl
          </a>{' '}
          lub w sekcji „Pomoc” w menu przeglądarki internetowej.
        </p>
      </div>
    </section>
  );
};

export default CookiePolicy;
