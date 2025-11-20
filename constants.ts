import { Semester, SubjectId } from './types';

// --- OCR CONTENT STORAGE (MEMORY REF) ---
// Expanded with specific details from handwritten notes (OCR)

const PPA_NOTES = `
C Language Overview:
- Developed in 1970s at Bell Laboratories by Dennis Ritchie.
- Characteristics: Middle level language, simple, efficient, structured. Suitable for system programming (OS like Unix) and application programming.

Structure of C Program:
1. Comments
2. Preprocessor directives
3. Global variables
4. main() function
5. Local variables
6. Statements

Elements of C:
- Character set: Alphabets (A-Z, a-z), Digits (0-9), Special chars.
- Delimiters: Colon (:), Semicolon (;), Parenthesis (), Square bracket [], Curly bracket {}, Hash #, Comma ,.
- Keywords (32): auto, break, case, char, const, continue, default, do, double, else, enum, extern, float, for, goto, if, int, long, register, return, short, signed, sizeof, static, struct, switch, typedef, union, unsigned, void, volatile, while.
- Identifiers: User defined names. Rules: alpha-numeric, start with letter/underscore, no keywords, case sensitive.

Data Types:
- int (2 bytes): Stores integers (-32768 to 32767).
- char (1 byte): Stores single character (-128 to 127).
- float (4 bytes): Single precision floating point (3.4E-38 to 3.4E+38).
- double (8 bytes): Double precision floating point.

Constants:
- Numeric: Integer (Decimal, Octal [starts with 0], Hexadecimal [starts with 0x]), Real (Floating point).
- Character: Single character in single quotes 'a'.
- String: Sequence of characters in double quotes "Hello".

Input/Output Statements (stdio.h):
1. Formatted I/O:
   - scanf(): Reads input. Uses control string (e.g., "%d", &variable). Requires address operator (&).
   - printf(): Writes output. Uses control string (e.g., "Value is %d", variable).
   - Format Specifiers: %c (char), %d (int), %f (float), %s (string), %lf (double).

2. Unformatted I/O:
   - getchar(): Reads a single character from keyboard. Waits for enter.
   - putchar(var): Writes a single character to screen.
   - getch(): Reads a character from console immediately without waiting for Enter (conio.h). Often used to hold screen.
   - gets(): Reads a string (line of text).
   - puts(): Writes a string.
   - clrscr(): Clears the screen (conio.h).

Operators:
- Unary: Increment (++), Decrement (--), Unary Minus (-).
- Binary: 
  - Arithmetic (+, -, *, /, %).
  - Relational (<, <=, >, >=, ==, !=). Returns 0 (false) or 1 (true).
  - Logical (&& [AND], || [OR], ! [NOT]).
  - Bitwise (&, |, ^, <<, >>).
- Ternary: Conditional operator (condition ? true_val : false_val).

Control Statements:
- Conditional: if, if-else, nested if, switch-case (multiple branch selection).
- Loops: 
  - while (entry controlled).
  - do-while (exit controlled, executes at least once).
  - for (initialization; condition; update).

Functions:
- Definition: Self-contained sub-program.
- Components: Function header, Body.
- Declaration: Return_type func_name(type arg1, ...);
- Calling: func_name(val1, val2);
- Call by Value: Copy of value passed. Original not changed.
- Call by Reference: Address passed. Original value can be changed.
- Recursion: Function calling itself. Base case required.

Algorithms & Flowcharts:
- Algorithm: Step-by-step logical solution.
- Flowchart Symbols: Oval (Start/Stop), Parallelogram (Input/Output), Rectangle (Process), Diamond (Decision), Arrows (Flow lines).
`;

const POM_NOTES = `
Management:
- Definition: Art of getting things done through others (Mary Parker Follett). "To manage is to forecast and to plan, to organize, to command, to co-ordinate and to control" (Henry Fayol).
- Nature: Goal oriented, Economic resource, Distinct process, Integrative force, Intangible force, Multi-disciplinary.
- Importance: Achieving group goals, Optimum utilization of resources, Social obligation, Economic growth, Stability.

Levels of Management:
1. Top Level: Board of Directors, CEO. Strategic planning, policy making.
2. Middle Level: Departmental heads (Production, Sales). Executing plans, coordinating.
3. Lower/Supervisory Level: Supervisors, Foremen. Operational control, direct workforce interaction.

Evolution of Management Thought:
1. Classical Approach:
   - Scientific Management (F.W. Taylor): Science not rule of thumb, Harmony not discord, Cooperation, Maximum output.
   - Administrative Theory (Henry Fayol): 14 Principles (Division of Work, Authority/Responsibility, Discipline, Unity of Command, Unity of Direction, Subordination of individual interest, Remuneration, Centralization, Scalar Chain, Order, Equity, Stability of Tenure, Initiative, Esprit de Corps).
   - Bureaucracy (Max Weber): Rules, hierarchy, impersonal.
2. Behavioural Approach: Elton Mayo (Hawthorne Experiments - social factors affect productivity).
3. Quantitative Approach: Mathematical models.

Functions of Management:
1. Planning: Deciding in advance. Steps: Objectives -> Forecasting -> Alternatives -> Selection. Types: Strategic, Operational.
2. Organizing: Structure (Line, Line & Staff, Functional, Matrix). Delegation vs Decentralization.
3. Staffing: Manpower planning, Recruitment, Selection, Training.
4. Directing: Supervision, Motivation, Leadership, Communication.
5. Controlling: Setting standards -> Measuring -> Comparing -> Correcting.

Motivation Theories:
- Maslow's Hierarchy: Physiological -> Safety -> Social -> Esteem -> Self-actualization.
- Herzberg's Two Factor: Hygiene factors (dissatisfiers) vs Motivators (satisfiers).

Leadership Styles:
- Autocratic (Leader decides).
- Democratic/Participative (Group decides).
- Laissez-faire (Free rein).

Communication: Process of exchange. 7 Cs (Clarity, Conciseness, Concrete, Correct, Coherent, Complete, Courteous). Barriers: Physical, Semantic, Psychological.
`;

const CFOA_NOTES = `
Computer Fundamentals:
- Definition: Electronic device for data processing.
- Characteristics: Speed, Accuracy, Diligence (no fatigue), Versatility, Storage.
- Block Diagram: Input Unit -> CPU (ALU + CU + MU) -> Output Unit.

Memory:
- Primary: RAM (Volatile, R/W), ROM (Non-volatile, Read only).
- Secondary: Hard Disk, Floppy, CD/DVD, Flash Drive.
- Units: Bit (0/1), Byte (8 bits), KB (1024 bytes), MB, GB, TB.

Software:
- System Software: OS (Windows, DOS, Linux), Drivers, Translators (Compiler, Interpreter, Assembler).
- Application Software: Word, Excel, PowerPoint.

Operating System (DOS):
- CUI (Character User Interface).
- Internal Commands: CLS, DIR, DATE, TIME, COPY, REN, DEL, MD (Make Dir), CD (Change Dir), RD (Remove Dir), TYPE, VOL, VER, PATH.
- External Commands: FORMAT, BACKUP, RESTORE, CHKDSK, XCOPY, TREE, MOVE, PRINT.

Windows:
- GUI (Graphical User Interface).
- Elements: Desktop, Icons, Taskbar, Start Button, Windows Explorer, Control Panel, Recycle Bin.
- Accessories: Notepad (Text editor), WordPad (Rich text), Paint (Images), Calculator.

Office Automation:
- Word Processor (MS Word): Creating, editing, formatting text documents. Features: Mail Merge, Spell check, Tables, Macros.
- Spreadsheet (MS Excel): Rows/Columns, Formulas (=SUM, =AVG), Charts (Bar, Pie, Line), Filtering, Sorting.
- Presentation (MS PowerPoint): Slides, Transitions, Animations.

Number Systems:
- Binary (Base 2): 0, 1.
- Octal (Base 8): 0-7.
- Decimal (Base 10): 0-9.
- Hexadecimal (Base 16): 0-9, A-F.
`;

const BC_NOTES = `
Business Communication:
- Meaning: Exchange of facts, ideas, opinions, or emotions by two or more persons.
- Process: Sender -> Encoding -> Message -> Channel -> Decoding -> Receiver -> Feedback.

Forms of Communication:
1. Verbal:
   - Oral: Meetings, Seminars, Interviews, Presentations, Telephone. Advantages: Fast, feedback, personal. Disadvantages: No record, distortion.
   - Written: Letters, Memos, Notices, Reports, Email. Advantages: Record, legal validity, precise. Disadvantages: Slow, expensive.
2. Non-Verbal: Kinesics (Body language), Proxemics (Space), Chronemics (Time), Haptics (Touch), Para-language (Voice tone).

Barriers to Communication:
- Physical: Noise, Distance, Defects in system.
- Semantic: Language differences, Jargon, Ambiguity.
- Organizational: Rigid rules, Hierarchy, Complexity.
- Psychological: Premature evaluation, Lack of attention, Distrust, Emotions.

Business Correspondence (Letters):
- Structure: Heading, Date, Reference, Inside Address, Salutation (Dear Sir), Subject, Body (Intro, Main, Conclusion), Complimentary Close (Yours faithfully), Signature.
- Types:
  - Enquiry & Reply.
  - Order & Execution.
  - Complaint & Adjustment.
  - Sales Letters (AIDA model: Attention, Interest, Desire, Action).
  - Circulars.

Report Writing:
- Types: Routine, Special, Informational, Interpretative.
- Structure: Title, Acknowledgement, Table of Contents, Abstract, Body, Conclusion, Recommendations, Bibliography.

Employment Communication:
- Resume/CV: Bio-data, Education, Experience, Skills, References.
- Cover Letter: Introduction, Why you fit, Request for interview.
`;

// --- SYLLABUS DEFINITION ---

export const SEMESTERS: Semester[] = [
  {
    id: 1,
    name: "Semester I",
    status: "active",
    subjects: [
      {
        id: SubjectId.PPA,
        name: "Prog. Principle & Algorithm",
        code: "BCA-S102T",
        icon: "fa-code",
        description: "C Language, Algorithms, and Logic.",
        knowledgeBase: PPA_NOTES,
        units: [
          { id: "u1", title: "Unit I: Introduction to C & Algorithms", isCompleted: false },
          { id: "u2", title: "Unit II: Operators & Expressions", isCompleted: false },
          { id: "u3", title: "Unit III: Control Structures (If/Loops)", isCompleted: false },
          { id: "u4", title: "Unit IV: Arrays & Strings", isCompleted: false },
          { id: "u5", title: "Unit V: Functions & Recursion", isCompleted: false },
          { id: "u6", title: "Unit VI: Pointers & Structures", isCompleted: false }
        ],
        systemInstruction: "You are a C Programming tutor. Answer directly and technically. Use the provided PPA_NOTES memory ref which contains details on getchar, putchar, scanf, printf, loops, and arrays. If asked about input/output functions, be specific about the difference between formatted (scanf) and unformatted (getchar) functions. Do not use phrases like 'According to the syllabus'. Just give the answer."
      },
      {
        id: SubjectId.CFOA,
        name: "Computer Fund. & Office Auto.",
        code: "BCA-S101T",
        icon: "fa-desktop",
        description: "Computer Basics, DOS, Windows, Office.",
        knowledgeBase: CFOA_NOTES,
        units: [
          { id: "u1", title: "Unit I: Introduction to Computers", isCompleted: false },
          { id: "u2", title: "Unit II: Algorithm & Flowcharts", isCompleted: false },
          { id: "u3", title: "Unit III: Operating System (DOS)", isCompleted: false },
          { id: "u4", title: "Unit IV: Windows Environment", isCompleted: false },
          { id: "u5", title: "Unit V: Word Processing", isCompleted: false },
          { id: "u6", title: "Unit VI: Spreadsheets & Presentations", isCompleted: false }
        ],
        systemInstruction: "You are a Computer Fundamentals tutor. Answer directly. Use the provided CFOA_NOTES regarding DOS commands (Internal/External), Computer Generations, and Office tools. Provide specific command syntax when asked. Do not mention 'based on notes'. Answer with authority."
      },
      {
        id: SubjectId.POM,
        name: "Principle of Management",
        code: "BCA-S103",
        icon: "fa-sitemap",
        description: "Planning, Organizing, Leadership.",
        knowledgeBase: POM_NOTES,
        units: [
          { id: "u1", title: "Unit I: Nature of Management", isCompleted: false },
          { id: "u2", title: "Unit II: Evolution of Mgt. Thought", isCompleted: false },
          { id: "u3", title: "Unit III: Planning & Organizing", isCompleted: false },
          { id: "u4", title: "Unit IV: Directing & Controlling", isCompleted: false },
          { id: "u5", title: "Unit V: Motivation & Leadership", isCompleted: false },
          { id: "u6", title: "Unit VI: Communication & Change", isCompleted: false }
        ],
        systemInstruction: "You are a Management professor. Answer directly using the POM_NOTES. Explain theories (Maslow, Fayol, Taylor) clearly. Do not reference the syllabus document in your text. Speak naturally as a teacher."
      },
      {
        id: SubjectId.BC,
        name: "Business Communication",
        code: "BCA-S104",
        icon: "fa-comments",
        description: "Communication skills, Letters, Reports.",
        knowledgeBase: BC_NOTES,
        units: [
          { id: "u1", title: "Unit I: Basics of Communication", isCompleted: false },
          { id: "u2", title: "Unit II: Verbal & Non-Verbal", isCompleted: false },
          { id: "u3", title: "Unit III: Barriers to Communication", isCompleted: false },
          { id: "u4", title: "Unit IV: Business Letters", isCompleted: false },
          { id: "u5", title: "Unit V: Report Writing", isCompleted: false },
          { id: "u6", title: "Unit VI: Employment Comm.", isCompleted: false }
        ],
        systemInstruction: "You are a Business Communication expert. Answer directly based on BC_NOTES. Focus on the 7Cs, letter formats, and communication barriers. Do not say 'The notes say...'. Just state the facts."
      },
      {
        id: SubjectId.MATHS,
        name: "Mathematics – I",
        code: "BCA-S105",
        icon: "fa-calculator",
        description: "Determinants, Matrices, Calculus.",
        knowledgeBase: "Determinants, Matrices (Inverse, Adjoint, Rank), Limits, Continuity, Differentiation (Chain rule, Maxima/Minima), Integration, Vector Algebra.", // Placeholder as no specific notes provided
        units: [
          { id: "u1", title: "Unit I: Determinants & Matrices", isCompleted: false },
          { id: "u2", title: "Unit II: Limits & Continuity", isCompleted: false },
          { id: "u3", title: "Unit III: Differentiation", isCompleted: false },
          { id: "u4", title: "Unit IV: Integration", isCompleted: false },
          { id: "u5", title: "Unit V: Vector Algebra", isCompleted: false }
        ],
        systemInstruction: "You are a Math tutor. Provide step-by-step solutions. Use LaTeX formatting for math. Answer directly."
      }
    ]
  },
  {
    id: 2,
    name: "Semester II",
    status: "coming_soon",
    subjects: []
  },
  {
    id: 3,
    name: "Semester III",
    status: "coming_soon",
    subjects: []
  },
    {
    id: 4,
    name: "Semester IV",
    status: "coming_soon",
    subjects: []
  },
    {
    id: 5,
    name: "Semester V",
    status: "coming_soon",
    subjects: []
  },
    {
    id: 6,
    name: "Semester VI",
    status: "coming_soon",
    subjects: []
  }
];