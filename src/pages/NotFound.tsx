import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="notfound">
      <h1>404</h1>
      <p>페이지를 찾을 수 없어요.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </section>
  );
}
