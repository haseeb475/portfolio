"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Menu, X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Portfolio() {
  const [currentSection, setCurrentSection] = useState('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const profileImageUrl = "https://media.licdn.com/dms/image/v2/D4E03AQEIw68O8rEm8A/profile-displayphoto-shrink_400_400/B4EZWgms1uGgAg-/0/1742156255081?e=1756339200&v=beta&t=zfSQ_H8SnmveQdmjFoKOp-k5CE5gh0N1O9ybuNnXLS8"; // Replace with your actual image URL
  const sections = {
    intro: {
      title: "About Me",
      content: "ComputerScience graduate with 2+ years of experience in full-stack development and cloud infrastructure automation. Proven track record of building scalable web applications using modern technologies including Python, Java, and RESTful APIs. Currently pursuing Master's in Computer & Systems Engineering while seeking opportunities to contribute to innovative cloud automation solutions and AI-driven development practices."
    },
    education: {
      title: "Education",
      content: [
        {
          institution: "Technische Universität Ilmenau, Germany",
          degree: "M.Sc. Research in Computer & Systems Engineering",
          period: "April 2025 – Present",
          details: "Coursework: Algorithms, Cloud Computing & System Security"
        },
        {
          institution: "FAST National University of Computer and Emerging Sciences",
          degree: "B.S. in Computer Science",
          period: "Aug 2019 – Jun 2023",
          gpa: "CGPA: 3.56/4.0",
          details: "Coursework: Object Oriented Programming, Data Structures, Natural Language Processing, Artificial Intelligence, Mining Massive Datasets, MLOPs, Data Mining, Digital Image Processing, Parallel and Distributed Computing, Web Programming and Software Design & Analysis"
        }
      ]
    },
    experience: {
      title: "Work Experience",
      content: [
        {
          company: "Cytomate",
          position: "Full Stack Developer (Remote)",
          period: "Sep 2023 – Dec 2024",
          achievements: [
            "Developed and maintained production-grade web applications using TypeScript, React.js, and Node.js, serving 1000+ active users across banking, healthcare, and government sectors",
            "Built modular UI components with React and Ant Design, streamlining interface scalability and improving delivery speed of frontend features by 40%",
            "Designed and secured REST APIs with role-based access control for mission-critical systems, implementing comprehensive authentication and authorization mechanisms",
            "Successfully migrated legacy .NET desktop application to Electron framework using TypeScript, enabling seamless cross-platform deployment across Windows, macOS, and Linux environments",
            "Automated product integration workflows by connecting marketplace APIs and configuring webhooks, eliminating manual processes and increasing deployment accuracy by 35%",
            "Implemented Redis caching strategies and optimized database queries, resulting in 60% improvement in API response times and enhanced system performance",
            "Contributed to secure PDF reporting module for system insights using Puppeteer, supporting auditing and regulatory compliance requirements",
            "Established centralized logging and monitoring infrastructure using Elasticsearch, playing a key role in achieving Common Criteria (CC) certification through enhanced traceability",
            "Collaborated with cross-functional teams using Scrum methodology, participating in sprint planning and daily standups to deliver features aligned with business objectives"
          ]
        },
        {
          company: "Alachisoft",
          position: "Software Engineer",
          period: "June 2023 – Aug 2023",
          achievements: [
            "Engineered high-performance enterprise software solutions using C# and .NET Framework, specifically optimized for distributed caching architectures",
            "Developed and implemented advanced serialization and deserialization protocols, enhancing data exchange speed by 40% and improving reliability in distributed systems",
            "Built scalable and maintainable backend modules leveraging NCache distributed caching technology, gaining expertise in memory management optimization and caching strategies",
            "Designed RESTful APIs with comprehensive error handling, input validation, and logging mechanisms for production-ready enterprise applications",
            "Collaborated with senior developers on code reviews and architectural decisions, contributing to clean code practices and system reliability improvement"
          ]
        }
      ]
    },
    projects: {
      title: "Technical Projects",
      content: [
        {
          name: "VStorm - Distributed Task Scheduler",
          type: "Bachelor Thesis Project",
          tech: "Apache Storm, Python, Machine Learning, Vue.js",
          description: [
            "Developed an intelligent scheduler for streaming big data processing on Apache Storm, optimizing resource allocation across distributed computing clusters",
            "Implemented machine learning algorithms to classify computational tasks as GPU-intensive, CPU-bound, or I/O-dependent in real-time, improving task distribution efficiency by 30%",
            "Created automated shell scripts for cluster deployment and configuration management, streamlining infrastructure setup and reducing manual intervention",
            "Built a comprehensive web-based dashboard using Vue.js for real-time cluster monitoring, resource utilization tracking, and performance analytics",
            "Achieved significant performance improvements over existing research solutions, with findings documented in ongoing academic publication",
            "Utilized Linux system administration skills for cluster management, including process monitoring, resource allocation, and automated scaling"
          ]
        },
        {
          name: "EduQuiz - AI-Powered Quiz Management System",
          type: "Academic Management Platform",
          tech: "Java, Spring Boot, MySQL, TensorFlow",
          description: [
            "Developed a comprehensive quiz management system with full Google Classroom functionality, including assignment distribution, student enrollment, and grade management",
            "Implemented AI-powered proctoring system using computer vision and machine learning models to detect suspicious behavior during online assessments",
            "Created automated cheating detection algorithms that analyze student behavior patterns, mouse movements, and focus changes, generating detailed reports for instructors",
            "Built RESTful APIs using Spring Boot framework for seamless integration between frontend and backend services, supporting concurrent user sessions",
            "Designed responsive user interfaces for both students and instructors, featuring real-time quiz monitoring and instant feedback mechanisms",
            "Integrated secure authentication system with role-based access control, ensuring data privacy and system integrity for educational institutions"
          ]
        },
        {
          name: "PrivateGPT - AI Document Assistant",
          type: "Enterprise AI Solution",
          tech: "Next.js, Python, Node.js, PostgreSQL",
          description: [
            "Developed an AI-powered internal GPT chat tool using OpenAI's API and vector embeddings for intelligent, context-aware document querying within enterprise environments",
            "Integrated SharePoint API for real-time data synchronization and automated content indexing, enabling seamless document management workflows",
            "Implemented comprehensive user-group permissions and persistent chat history features, ensuring secure and scalable interactions for large organizations",
            "Built containerized microservices architecture using Docker, facilitating easy deployment and scaling across different infrastructure environments",
            "Created automated data pipeline for document processing and embedding generation, reducing manual content preparation time by 70%"
          ]
        }
      ]
    },
    skills: {
      title: "Technical Skills",
      content: {
        "Programming Languages": "Python, Java, C#, JavaScript, TypeScript, C++, SQL, Shell Scripting",
        "Web Technologies": "React.js, Next.js, Node.js, Express.js, RESTful APIs, GraphQL, WebSocket",
        "Frameworks & Tools": "Spring Boot, .NET Framework, Electron, Docker, Git, Kubernetes",
        "Databases": "MySQL, PostgreSQL, MongoDB, Redis, Elasticsearch",
        "Cloud Platforms": "AWS (Lambda, S3, DynamoDB), Azure DevOps, Google Cloud Platform",
        "AI/ML": "TensorFlow, OpenAI API, Machine Learning, Vector Embeddings, Prompt Engineering",
        "Operating Systems": "Linux, Windows, macOS (Cross-platform development experience)",
        "Development Practices": "Agile/Scrum, CI/CD Pipelines, Test-Driven Development, Code Review"
      }
    }
  };

  const navItems = [
    { key: 'intro', label: 'About Me' },
    { key: 'education', label: 'Education' },
    { key: 'experience', label: 'Experience' },
    { key: 'projects', label: 'Projects' },
    { key: 'skills', label: 'Skills' }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          type: 'bot',
          content: "welcome",
          timestamp: new Date()
        }]);
      }, 1000);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSectionClick = (sectionKey) => {
    setCurrentSection(sectionKey);
    setIsMenuOpen(false);

    const userMessage = {
      type: 'user',
      content: `Tell me about ${sections[sectionKey].title.toLowerCase()}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMessage = {
        type: 'bot',
        content: sectionKey,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const renderContent = (sectionKey) => {
    const section = sections[sectionKey];

    switch (sectionKey) {
      case 'intro':
        return (
          <motion.div
            className="space-y-4"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-300 leading-relaxed">{section.content}</p>
          </motion.div>
        );

      case 'education':
        return (
          <motion.div
            className="space-y-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {section.content.map((edu, index) => (
              <motion.div
                key={index}
                className="border-l-2 border-blue-500 pl-4 space-y-2"
                variants={staggerItem}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <h4 className="font-semibold text-white">{edu.institution}</h4>
                <p className="text-blue-400 font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-400">{edu.period}</p>
                {edu.gpa && <p className="text-sm text-gray-400">{edu.gpa}</p>}
                <p className="text-gray-300 text-sm">{edu.details}</p>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {section.content.map((job, index) => (
              <motion.div
                key={index}
                className="space-y-4"
                variants={staggerItem}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="border-l-2 border-green-500 pl-4">
                  <h4 className="font-semibold text-white">{job.company}</h4>
                  <p className="text-green-400 font-medium">{job.position}</p>
                  <p className="text-sm text-gray-400">{job.period}</p>
                </div>
                <ul className="space-y-2 ml-6">
                  {job.achievements.map((achievement, idx) => (
                    <motion.li
                      key={idx}
                      className="text-gray-300 text-sm leading-relaxed flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <span className="text-green-400 mr-2 mt-1.5 flex-shrink-0">•</span>
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {section.content.map((project, index) => (
              <motion.div
                key={index}
                className="space-y-4"
                variants={staggerItem}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="border-l-2 border-purple-500 pl-4">
                  <h4 className="font-semibold text-white">{project.name}</h4>
                  <p className="text-purple-400 font-medium">{project.type}</p>
                  <p className="text-sm text-gray-400">{project.tech}</p>
                </div>
                <ul className="space-y-2 ml-6">
                  {project.description.map((desc, idx) => (
                    <motion.li
                      key={idx}
                      className="text-gray-300 text-sm leading-relaxed flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <span className="text-purple-400 mr-2 mt-1.5 flex-shrink-0">•</span>
                      {desc}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            className="space-y-4"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {Object.entries(section.content).map(([category, skills], index) => (
              <motion.div
                key={category}
                className="space-y-2"
                variants={staggerItem}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <h4 className="font-semibold text-orange-400">{category}:</h4>
                <p className="text-gray-300 text-sm leading-relaxed ml-4">{skills}</p>
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={profileImageUrl}  // ← USED HERE
                alt="Haseeb Ramzan"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              />            </motion.div>

            <div>
              <h1 className="text-xl font-bold">Haseeb Ramzan</h1>
              <p className="text-sm text-gray-400">Full Stack Developer</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                onClick={() => handleSectionClick(item.key)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentSection === item.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {item.label}
              </motion.button>
            ))}
            {/* Download Resume Button */}
            <motion.a
              href="/Haseeb_Resume_.pdf" // Replace with your actual resume file path
              download="Haseeb_Ramzan_Resume.pdf"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Download Resume</span>
            </motion.a>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-gray-800 border-t border-gray-700"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-2 p-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.key}
                    onClick={() => handleSectionClick(item.key)}
                    className={`px-4 py-3 rounded-lg text-left transition-all duration-200 ${currentSection === item.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.a
                  href="/Haseeb_Resume_.pdf" // Replace with your actual resume file path
                  download="Haseeb_Ramzan_Resume.pdf"
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 justify-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Download Resume</span>
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="pt-20 pb-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Chat Interface */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 min-h-[80vh] flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {/* Chat Header */}
            <motion.div
              className="p-6 border-b border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.img
                    src={profileImageUrl}  // ← USED HERE
                    alt="Haseeb Ramzan"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  />                </motion.div>
                <div>
                  <h2 className="font-semibold">Haseeb Ramzan</h2>
                  <p className="text-sm text-gray-400">Ask me about my experience, skills, or projects</p>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={message.type === 'user' ? slideInRight.initial : slideInLeft.initial}
                    animate={message.type === 'user' ? slideInRight.animate : slideInLeft.animate}
                    exit={message.type === 'user' ? slideInRight.exit : slideInLeft.exit}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className={`max-w-[90%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                            : 'bg-gradient-to-r from-green-500 to-blue-500'
                            }`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </motion.div>
                        <motion.div
                          className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {message.type === 'bot' && message.content === 'welcome' ? (
                            <motion.div
                              className="space-y-6"
                              initial="initial"
                              animate="animate"
                              variants={staggerContainer}
                            >
                              <motion.div
                                className="text-center space-y-4"
                                variants={staggerItem}
                              >
                                <motion.div
                                  className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-6"
                                  animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{
                                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity }
                                  }}
                                >
                                  <User className="w-10 h-10" />
                                </motion.div>
                                <motion.h1
                                  className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                  variants={staggerItem}
                                >
                                  Welcome to My Portfolio
                                </motion.h1>
                                <motion.h2
                                  className="text-xl text-gray-300"
                                  variants={staggerItem}
                                >
                                  Haseeb Ramzan
                                </motion.h2>
                                <motion.p
                                  className="text-lg text-blue-400 font-medium"
                                  variants={staggerItem}
                                >
                                  Full Stack Developer & Cloud Solutions Engineer
                                </motion.p>
                                <motion.div
                                  className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"
                                  variants={staggerItem}
                                  animate={{ scaleX: [0, 1] }}
                                  transition={{ duration: 1, delay: 1 }}
                                ></motion.div>
                              </motion.div>

                              <motion.div
                                className="bg-gray-800/50 rounded-xl p-6 border border-gray-600"
                                variants={staggerItem}
                              >
                                <p className="text-gray-300 leading-relaxed text-center">
                                  Computer Science graduate with <span className="text-blue-400 font-semibold">2+ years of experience</span> in full-stack development and cloud infrastructure automation. Currently pursuing <span className="text-purple-400 font-semibold">Master's in Computer & Systems Engineering</span> at Technische Universität Ilmenau, Germany.
                                </p>
                              </motion.div>

                              <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                variants={staggerContainer}
                              >
                                {[
                                  { number: "1000+", label: "Active Users Served", color: "blue" },
                                  { number: "60%", label: "Performance Improvement", color: "green" },
                                  { number: "3", label: "Major Projects", color: "purple" }
                                ].map((stat, index) => (
                                  <motion.div
                                    key={index}
                                    className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-lg p-4 border border-${stat.color}-500/30`}
                                    variants={staggerItem}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <motion.div
                                      className={`text-2xl font-bold text-${stat.color}-400`}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: index * 0.2 + 1.5, type: "spring" }}
                                    >
                                      {stat.number}
                                    </motion.div>
                                    <div className="text-sm text-gray-300">{stat.label}</div>
                                  </motion.div>
                                ))}
                              </motion.div>

                              <motion.div
                                className="text-center"
                                variants={staggerItem}
                              >
                                <p className="text-gray-400 mb-4">Click on the navigation above to explore different sections!</p>
                              </motion.div>
                            </motion.div>
                          ) : message.type === 'bot' && typeof message.content === 'string' && sections[message.content] ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.h3
                                className="font-semibold mb-3 text-lg"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {sections[message.content].title}
                              </motion.h3>
                              {renderContent(message.content)}
                            </motion.div>
                          ) : (
                            <motion.p
                              className="leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {message.content}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                      <motion.p
                        className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div
                        className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.7)",
                            "0 0 0 10px rgba(34, 197, 94, 0)",
                            "0 0 0 0 rgba(34, 197, 94, 0)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot className="w-5 h-5" />
                      </motion.div>
                      <motion.div
                        className="bg-gray-700 rounded-2xl px-4 py-3"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                          ></motion.div>
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          ></motion.div>
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 border-t border-gray-700 py-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            className="flex justify-center space-x-6 mb-4"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {[
              { href: "https://github.com/haseeb475", icon: Github, label: "GitHub" },
              { href: "https://www.linkedin.com/in/haseebramzan/", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:haseeb277476@gmail.com", icon: Mail, label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                variants={staggerItem}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  color: social.label === 'GitHub' ? '#ffffff' :
                    social.label === 'LinkedIn' ? '#0077b5' : '#ea4335'
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>
          <motion.p
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            Built with React & Tailwind CSS • Enhanced with Framer Motion
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}