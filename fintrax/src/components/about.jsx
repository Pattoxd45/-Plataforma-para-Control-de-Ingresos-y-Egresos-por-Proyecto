import React from 'react';
import '../styles/about.css';
import fintraxLogo from '../images/fintrax.png';

const About = () => {
  return (
    <section className="about-container">
      <img src={fintraxLogo} alt="Logo de Fintrax" className="about-logo" />
      <h1 className="about-title">Fintrax</h1>
      <p>
        En <strong>Fintrax</strong> somos un equipo de tres emprendedores — Carlos Ulloa, Patricio Valdés y Victor Sepúlveda — apasionados por facilitar la vida financiera de quienes manejan proyectos y empresas.
      </p>
      <p>
        Nuestra misión es simple pero poderosa: <strong>ayudarte a llevar un registro claro y ordenado de ingresos y egresos por proyecto</strong>, con estadísticas fáciles de entender que te permitan tomar mejores decisiones para tu negocio.
      </p>
      <p>
        Fintrax nació como un proyecto universitario, pero rápidamente nos dimos cuenta de que podía convertirse en una herramienta útil para muchos. Queremos que administrar tus finanzas sea sencillo y agradable, sin complicaciones ni términos técnicos que solo confundan.
      </p>
      <h2>Lo que creemos</h2>
      <ul>
        <li><strong>Simplicidad:</strong> La gestión financiera no debería ser un dolor de cabeza.</li>
        <li><strong>Confianza:</strong> Cuidamos tu información con el máximo respeto y seguridad.</li>
        <li><strong>Eficiencia:</strong> Para que puedas dedicar más tiempo a hacer crecer tu negocio.</li>
        <li><strong>Colaboración:</strong> Escuchando siempre las necesidades reales de nuestros usuarios para mejorar día a día.</li>
      </ul>
      <p>
        Si tienes una empresa o estás a cargo de proyectos, Fintrax está pensado para ti. Queremos ser tu compañero confiable para que el control de tus ingresos y egresos sea una tarea sencilla, clara y hasta divertida.
      </p>
      <p className="about-footer">¡Bienvenido a Fintrax, donde tus finanzas se organizan sin estrés!</p>
    </section>
  );
};

export default About;
