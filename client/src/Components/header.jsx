import { Col, Row } from 'reactstrap';

function Header({ msg }) {
  return (
    <div className="header rounded px-3 px-sm-4 py-3 py-sm-5">
      <Row>
        <Col md="12">
          <h1>Welcome!!! {msg}</h1>
        </Col>
      </Row>
    </div>
  );
}
export default Header;
