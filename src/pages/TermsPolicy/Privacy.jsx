import React from 'react';
import { Container, Card, Accordion } from 'react-bootstrap';
import logo from '../../assets/images/MPF-logo.svg';

const PrivacyPolicy = () => {
    return (
        <Container className="my-5" style={{ maxWidth: '960px' }}>
            <div className="text-center mb-5">
                <img src={logo} alt="MyPathfinder logo" style={{ maxWidth: 540, marginBottom: 28 }} />
                <h1 className="display-4 text-primary mb-3" style={{ fontWeight: 700 }}>Privacy Policy</h1>
                <p className="lead text-muted">
                    Effective Date: 09/09/2025 • Reviewed: 17/10/2025
                </p>
                <p className="text-muted">
                    Company: MyPathfinder Ltd ("MyPathfinder", "we", "us", "our")
                </p>
            </div>

            <Card className="shadow-sm mb-4">
                <Card.Body className="p-4">
                    <p className="mb-4">
                        We are committed to protecting and respecting your privacy. This Privacy
                        Policy explains how we collect, use, store, and share your personal data
                        when you use MyPathfinder's services. It also outlines your legal rights
                        under the UK General Data Protection Regulation (UK GDPR) and the Data
                        Protection Act 2018.
                    </p>
                    <p>
                        MyPathfinder Ltd is registered as a Data Controller with the Information
                        Commissioner's Office (ICO) under registration number: <strong>ZB979330</strong>
                    </p>
                </Card.Body>
            </Card>

            <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h5 className="mb-0">1. Data We Collect</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>We collect the following types of personal data from users:</p>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <strong>Identity Data:</strong> Full name.
                            </li>
                            <li className="mb-2">
                                <strong>Contact Data:</strong> Email address, phone number.
                            </li>
                            <li className="mb-2">
                                <strong>Career Data:</strong> CV details (including education, employment history,
                                skills, location, personal statements). CVs are processed in JSON format
                                and are not permanently stored unless the user chooses to save them.
                            </li>
                            <li className="mb-2">
                                <strong>Usage Data:</strong> Account login details, platform interactions, preferences,
                                feedback.
                            </li>
                            <li className="mb-2">
                                <strong>Technical Data:</strong> IP address, device identifiers, browser type, cookies
                                (see Cookie Policy).
                            </li>
                            <li className="mb-2">
                                <strong>Video/Audio Data:</strong> Interview recordings uploaded to our platform.
                            </li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <h5 className="mb-0">2. How We Use Your Data</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>We use your personal data to:</p>
                        <ul>
                            <li>Provide our core services: CV tailoring, job-matching, interview
                                preparation, and career resources.</li>
                            <li>Improve and develop our platform through analytics and service
                                optimisation.</li>
                            <li>Communicate with you about your account, updates, or customer
                                support.</li>
                            <li>Comply with legal obligations (e.g. fraud prevention, safeguarding).</li>
                        </ul>
                        <p className="mt-3">
                            We will not use your personal data for purposes that are incompatible
                            with those listed above.
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <h5 className="mb-0">3. How We Store & Secure Your Data</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li className="mb-2">
                                Data is hosted on AWS (EC2 instances) in the London (UK) region,
                                ensuring data remains within the UK.
                            </li>
                            <li className="mb-2">
                                Interview video storage and processing are conducted on AWS servers.
                            </li>
                            <li className="mb-2">
                                We use encryption in transit (TLS) and at rest, access controls, and
                                regular security monitoring.
                            </li>
                            <li className="mb-2">
                                Personal data is retained only as long as necessary:
                                <ul className="mt-2">
                                    <li><strong>CVs:</strong> Deleted immediately unless user opts to save.</li>
                                    <li><strong>Account data:</strong> Retained until account deletion + 6 years (for
                                        legal/contractual records).</li>
                                    <li><strong>Interview videos:</strong> Deleted after 90 days unless retained at user's
                                        request.</li>
                                </ul>
                            </li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <h5 className="mb-0">4. Third-Party Services</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            We only share personal data with trusted providers necessary to deliver
                            our services:
                        </p>
                        <ul>
                            <li><strong>OpenAI (LLM services):</strong> Processing of text for CVs, interview
                                feedback.</li>
                            <li><strong>AWS:</strong> Secure hosting and data storage.</li>
                        </ul>
                        <p className="mt-3">
                            All third parties are contractually bound to UK GDPR compliance and act
                            only on our instructions.
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                    <Accordion.Header>
                        <h5 className="mb-0">5. Your Rights</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>Under UK GDPR, you have the following rights:</p>
                        <ul>
                            <li><strong>Access</strong> — request a copy of your data.</li>
                            <li><strong>Rectification</strong> — request correction of inaccurate or incomplete data.</li>
                            <li><strong>Erasure ("Right to be Forgotten")</strong> — request deletion of your personal data.</li>

                            <li><strong>Restriction</strong> — request restriction of how we process your data.</li>
                            <li><strong>Portability</strong> — request transfer of your data to another provider.</li>
                            <li><strong>Objection</strong> — object to certain types of processing, including direct marketing.</li>
                        </ul>
                        <p className="mt-3">
                            To exercise these rights, contact us at:{" "}
                            <a href="mailto:hello@mypathfinder.uk">hello@mypathfinder.uk</a>
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                    <Accordion.Header>
                        <h5 className="mb-0">6. Children's Data</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            Our services are intended for individuals aged 16 and above. We do not
                            knowingly collect personal data from children under 16.
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                    <Accordion.Header>
                        <h5 className="mb-0">7. International Transfers</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            We do not transfer personal data outside the UK unless adequate
                            safeguards are in place (e.g. UK Addendum to EU SCCs).
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                    <Accordion.Header>
                        <h5 className="mb-0">8. Legal Basis for Processing</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>We process your personal data on the following lawful bases:</p>
                        <ul>
                            <li><strong>Contract:</strong> To provide the services you have subscribed to.</li>
                            <li><strong>Consent:</strong> For optional features (e.g. saved CVs, marketing communications).</li>
                            <li><strong>Legitimate Interests:</strong> Service improvement, fraud prevention.</li>
                            <li><strong>Legal Obligation:</strong> Compliance with UK law.</li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="8">
                    <Accordion.Header>
                        <h5 className="mb-0">9. Changes to This Policy</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            We may update this Privacy Policy from time to time. Significant changes
                            will be notified via email or on the platform.
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="9">
                    <Accordion.Header>
                        <h5 className="mb-0">10. Contact Us</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>For any privacy-related queries, please contact:</p>
                        <address>
                            <strong>Data Protection Officer</strong><br />
                            MyPathfinder Ltd<br />
                            Email: <a href="mailto:hello@mypathfinder.uk">hello@mypathfinder.uk</a>
                        </address>
                        <p className="mt-3">
                            You also have the right to lodge a complaint with the Information
                            Commissioner's Office (ICO):{" "}
                            <a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer">
                                www.ico.org.uk
                            </a>
                        </p>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Card className="border-0 bg-light mt-4">
                <Card.Body className="text-center py-4">
                    <p className="text-muted mb-0">
                        &copy; {new Date().getFullYear()} MyPathfinder Ltd. All rights reserved.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PrivacyPolicy;