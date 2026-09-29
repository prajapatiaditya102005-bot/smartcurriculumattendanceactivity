import bcrypt from 'bcryptjs';
import {
  IUser,
  IClass,
  IAttendance,
  IAssignment,
  ISubmission,
  IAnnouncement,
  IQuery,
  ICurriculum,
  IDefaulterReport
} from '../types';

const defaultHashedPassword = bcrypt.hashSync('password123', 10);

export class MockDataStore {
  public users: IUser[] = [
    {
      _id: 'usr_admin_1',
      name: 'Dr. Arushi Prajapati',
      email: 'admin@smartedu.edu',
      password: defaultHashedPassword,
      role: 'admin',
      department: 'Dean of Academic Affairs',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-01T08:00:00.000Z'
    },
    {
      _id: 'usr_faculty_1',
      name: 'Dr. Sarah Jenkins',
      email: 'faculty@smartedu.edu',
      password: defaultHashedPassword,
      role: 'faculty',
      department: 'Computer Science & AI',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-05T09:00:00.000Z'
    },
    {
      _id: 'usr_faculty_2',
      name: 'Prof. Alan Turing',
      email: 'faculty2@smartedu.edu',
      password: defaultHashedPassword,
      role: 'faculty',
      department: 'Theoretical Computing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-05T09:30:00.000Z'
    },
    {
      _id: 'usr_student_1',
      name: 'John Doe',
      email: 'student@smartedu.edu',
      password: defaultHashedPassword,
      role: 'student',
      enrollment_no: 'ST-2026-CS001',
      department: 'B.Tech Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      face_embedding: [0.12, -0.45, 0.78, 0.33, -0.19, 0.65],
      createdAt: '2026-08-10T10:00:00.000Z'
    },
    {
      _id: 'usr_student_2',
      name: 'Alex Rivera',
      email: 'student2@smartedu.edu',
      password: defaultHashedPassword,
      role: 'student',
      enrollment_no: 'ST-2026-CS002',
      department: 'B.Tech Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      face_embedding: [-0.31, 0.22, 0.44, -0.89, 0.15, -0.07],
      createdAt: '2026-08-10T10:15:00.000Z'
    },
    {
      _id: 'usr_student_3',
      name: 'Maya Patel',
      email: 'student3@smartedu.edu',
      password: defaultHashedPassword,
      role: 'student',
      enrollment_no: 'ST-2026-CS003',
      department: 'B.Tech Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      face_embedding: [0.55, -0.12, 0.31, 0.49, -0.22, 0.81],
      createdAt: '2026-08-10T10:30:00.000Z'
    },
    {
      _id: 'usr_parent_1',
      name: 'Robert Doe',
      email: 'parent@smartedu.edu',
      password: defaultHashedPassword,
      role: 'parent',
      linked_student_id: 'usr_student_1',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-12T11:00:00.000Z'
    }
  ];

  public classes: IClass[] = [
    {
      _id: 'cls_cs301',
      subject: 'Data Structures & Algorithms',
      code: 'CS-301',
      faculty_id: 'usr_faculty_1',
      faculty_name: 'Dr. Sarah Jenkins',
      room: 'Smart Lab 402',
      semester: 'Semester V',
      department: 'Computer Science',
      schedule: [
        { day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM' },
        { day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM' },
        { day: 'Friday', startTime: '09:00 AM', endTime: '10:00 AM' }
      ],
      students: ['usr_student_1', 'usr_student_2', 'usr_student_3']
    },
    {
      _id: 'cls_cs305',
      subject: 'AI & Computer Vision Biometrics',
      code: 'CS-305',
      faculty_id: 'usr_faculty_1',
      faculty_name: 'Dr. Sarah Jenkins',
      room: 'Robotics & AI Center 305',
      semester: 'Semester V',
      department: 'Computer Science',
      schedule: [
        { day: 'Monday', startTime: '11:15 AM', endTime: '12:45 PM' },
        { day: 'Thursday', startTime: '11:15 AM', endTime: '12:45 PM' }
      ],
      students: ['usr_student_1', 'usr_student_2', 'usr_student_3']
    },
    {
      _id: 'cls_cs310',
      subject: 'Database Systems & NoSQL Atlas',
      code: 'CS-310',
      faculty_id: 'usr_faculty_2',
      faculty_name: 'Prof. Alan Turing',
      room: 'Computing Hub 208',
      semester: 'Semester V',
      department: 'Computer Science',
      schedule: [
        { day: 'Tuesday', startTime: '02:00 PM', endTime: '03:30 PM' },
        { day: 'Thursday', startTime: '02:00 PM', endTime: '03:30 PM' }
      ],
      students: ['usr_student_1', 'usr_student_2', 'usr_student_3']
    },
    {
      _id: 'cls_cs320',
      subject: 'Cloud & Distributed Computing',
      code: 'CS-320',
      faculty_id: 'usr_faculty_2',
      faculty_name: 'Prof. Alan Turing',
      room: 'Cloud Center 512',
      semester: 'Semester V',
      department: 'Computer Science',
      schedule: [
        { day: 'Wednesday', startTime: '03:30 PM', endTime: '05:00 PM' },
        { day: 'Friday', startTime: '03:30 PM', endTime: '05:00 PM' }
      ],
      students: ['usr_student_1', 'usr_student_2', 'usr_student_3']
    }
  ];

  public attendance: IAttendance[] = [
    // Pre-seeded attendance logs for historical reports & donut charts
    {
      _id: 'att_1',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      student_enrollment: 'ST-2026-CS001',
      date: '2026-09-21',
      time: '09:02:14',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.984
    },
    {
      _id: 'att_2',
      class_id: 'cls_cs305',
      class_name: 'AI & Computer Vision Biometrics',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      student_enrollment: 'ST-2026-CS001',
      date: '2026-09-21',
      time: '11:17:05',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.972
    },
    {
      _id: 'att_3',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      student_id: 'usr_student_2',
      student_name: 'Alex Rivera',
      student_enrollment: 'ST-2026-CS002',
      date: '2026-09-21',
      time: '09:05:00',
      status: 'absent',
      method: 'manual',
      confidence: 1.0
    },
    {
      _id: 'att_4',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      student_id: 'usr_student_3',
      student_name: 'Maya Patel',
      student_enrollment: 'ST-2026-CS003',
      date: '2026-09-21',
      time: '09:01:45',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.991
    },
    {
      _id: 'att_5',
      class_id: 'cls_cs310',
      class_name: 'Database Systems & NoSQL Atlas',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      student_enrollment: 'ST-2026-CS001',
      date: '2026-09-22',
      time: '14:03:22',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.965
    },
    {
      _id: 'att_6',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      student_enrollment: 'ST-2026-CS001',
      date: '2026-09-23',
      time: '09:04:10',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.988
    },
    {
      _id: 'att_7',
      class_id: 'cls_cs305',
      class_name: 'AI & Computer Vision Biometrics',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      student_enrollment: 'ST-2026-CS001',
      date: '2026-09-24',
      time: '11:16:40',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.978
    },
    {
      _id: 'att_8',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      student_enrollment: 'ST-2026-CS001',
      date: '2026-09-25',
      time: '09:02:50',
      status: 'present',
      method: 'face_recognition',
      confidence: 0.995
    },
    {
      _id: 'att_9',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      student_id: 'usr_student_2',
      student_name: 'Alex Rivera',
      student_enrollment: 'ST-2026-CS002',
      date: '2026-09-25',
      time: '09:12:00',
      status: 'late',
      method: 'face_recognition',
      confidence: 0.912
    }
  ];

  public assignments: IAssignment[] = [
    {
      _id: 'asg_1',
      class_id: 'cls_cs305',
      class_name: 'AI & Computer Vision Biometrics',
      title: 'Lab 3: Real-Time Face Recognition & CLAHE Enhancement',
      description: 'Implement an OpenCV pipeline with histogram equalization to process low-light classroom frames and compute Euclidean face similarity against registered student embeddings.',
      deadline: '2026-10-05T23:59:59.000Z',
      file_url: 'https://example.com/docs/ai_lab3_spec.pdf',
      created_by: 'usr_faculty_1',
      created_by_name: 'Dr. Sarah Jenkins',
      total_marks: 100,
      createdAt: '2026-09-20T10:00:00.000Z'
    },
    {
      _id: 'asg_2',
      class_id: 'cls_cs301',
      class_name: 'Data Structures & Algorithms',
      title: 'Assignment 4: AVL Trees and Red-Black Balanced Trees',
      description: 'Benchmark search, insertion, and deletion complexity across 100,000 randomized nodes. Submit full source code and analysis PDF.',
      deadline: '2026-09-30T23:59:59.000Z',
      file_url: 'https://example.com/docs/dsa_assignment4.pdf',
      created_by: 'usr_faculty_1',
      created_by_name: 'Dr. Sarah Jenkins',
      total_marks: 50,
      createdAt: '2026-09-18T14:30:00.000Z'
    },
    {
      _id: 'asg_3',
      class_id: 'cls_cs310',
      class_name: 'Database Systems & NoSQL Atlas',
      title: 'Project Milestone 2: MongoDB Aggregation Pipelines & Sharding',
      description: 'Design optimized aggregation pipelines for computing institutional attendance metrics across 1M records with compound index performance analysis.',
      deadline: '2026-10-12T23:59:59.000Z',
      file_url: 'https://example.com/docs/dbms_milestone2.pdf',
      created_by: 'usr_faculty_2',
      created_by_name: 'Prof. Alan Turing',
      total_marks: 100,
      createdAt: '2026-09-22T09:15:00.000Z'
    }
  ];

  public submissions: ISubmission[] = [
    {
      _id: 'sub_1',
      assignment_id: 'asg_2',
      assignment_title: 'Assignment 4: AVL Trees and Red-Black Balanced Trees',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      file_url: 'https://github.com/smartedu/dsa-avl-tree-benchmark.zip',
      submitted_at: '2026-09-24T18:40:00.000Z',
      grade: 48,
      feedback: 'Excellent tree rotation implementation! Time complexity graphs were very clear and well-documented.',
      status: 'graded'
    },
    {
      _id: 'sub_2',
      assignment_id: 'asg_2',
      assignment_title: 'Assignment 4: AVL Trees and Red-Black Balanced Trees',
      student_id: 'usr_student_2',
      student_name: 'Alex Rivera',
      file_url: 'https://github.com/alexrivera/dsa-redblack.zip',
      submitted_at: '2026-09-25T11:20:00.000Z',
      status: 'submitted'
    }
  ];

  public announcements: IAnnouncement[] = [
    {
      _id: 'anc_1',
      title: '🚀 Smart Curriculum & Attendance Platform Active!',
      body: 'Welcome to the Smart Curriculum & Attendance platform. All student biometric face models have been initialized. Please verify your daily schedule and mark attendance seamlessly.',
      posted_by: 'usr_admin_1',
      posted_by_name: 'Dr. Arushi Prajapati (Admin)',
      role_target: 'all',
      priority: 'urgent',
      createdAt: '2026-09-25T08:30:00.000Z'
    },
    {
      _id: 'anc_2',
      title: '📊 Mid-Term NAAC & AICTE Attendance Compliance Notice',
      body: 'Per regulatory directives (NAAC Criterion 2.3 & UGC guidelines), a minimum 75% aggregate attendance is required to qualify for end-semester examinations. Defaulter lists are automatically generated.',
      posted_by: 'usr_admin_1',
      posted_by_name: 'Dr. Arushi Prajapati (Admin)',
      role_target: 'all',
      priority: 'high',
      createdAt: '2026-09-24T12:00:00.000Z'
    },
    {
      _id: 'anc_3',
      title: '🔬 Computer Vision Lab Extra Practice Sessions',
      body: 'The AI & Computer Vision Lab (Room 305) will be open this Saturday 10:00 AM - 02:00 PM for hands-on practice with OpenCV dlib facial models.',
      posted_by: 'usr_faculty_1',
      posted_by_name: 'Dr. Sarah Jenkins',
      role_target: 'student',
      priority: 'normal',
      createdAt: '2026-09-23T15:45:00.000Z'
    },
    {
      _id: 'anc_4',
      title: '👨‍👩‍👧 Parent-Teacher Academic Review Portal Available',
      body: 'Parents can now track real-time daily lecture attendance timestamps and assignment performance directly via their dedicated Parent Dashboard.',
      posted_by: 'usr_faculty_1',
      posted_by_name: 'Dr. Sarah Jenkins',
      role_target: 'parent',
      priority: 'normal',
      createdAt: '2026-09-22T09:00:00.000Z'
    }
  ];

  public queries: IQuery[] = [
    {
      _id: 'qry_1',
      student_id: 'usr_student_1',
      student_name: 'John Doe',
      faculty_id: 'usr_faculty_1',
      faculty_name: 'Dr. Sarah Jenkins',
      subject: 'CLAHE Parameters in Low-Light Face Scanner',
      message: 'Professor, during the webcam face recognition test in dim lighting, should we calibrate the CLAHE clipLimit to 2.0 or 3.0 for the best Euclidean distance match?',
      reply: 'Great observation, John! Setting clipLimit to 3.0 with tileGridSize=(8,8) yields higher edge contrast around eye landmarks in under-lit lecture halls.',
      reply_at: '2026-09-24T16:20:00.000Z',
      status: 'answered',
      createdAt: '2026-09-24T14:10:00.000Z'
    },
    {
      _id: 'qry_2',
      student_id: 'usr_student_2',
      student_name: 'Alex Rivera',
      faculty_id: 'usr_faculty_2',
      faculty_name: 'Prof. Alan Turing',
      subject: 'Query on NoSQL Compound Index Cardinality',
      message: 'Could you please clarify how indexing on { class_id: 1, date: -1, student_id: 1 } reduces B-Tree index scan time during report generation?',
      status: 'open',
      createdAt: '2026-09-25T17:30:00.000Z'
    }
  ];

  public curriculum: ICurriculum[] = [
    {
      _id: 'cur_cs301',
      class_id: 'cls_cs301',
      subject_name: 'Data Structures & Algorithms',
      syllabus: [
        {
          module_number: 1,
          title: 'Asymptotic Notation, Master Theorem & Recurrences',
          topics: ['Big-O, Big-Omega, Big-Theta', 'Master Theorem for Divide & Conquer', 'Amortized Analysis'],
          completed: true,
          hours_allocated: 8
        },
        {
          module_number: 2,
          title: 'Self-Balancing Binary Search Trees',
          topics: ['AVL Tree Rotations', 'Red-Black Properties & Insertion', 'B-Trees and B+ Trees'],
          completed: true,
          hours_allocated: 10
        },
        {
          module_number: 3,
          title: 'Graph Algorithms & Dynamic Programming',
          topics: ['Dijkstra & Bellman-Ford', 'Floyd-Warshall All-Pairs Shortest Path', '0/1 Knapsack, Matrix Chain'],
          completed: false,
          hours_allocated: 14
        },
        {
          module_number: 4,
          title: 'Advanced Data Structures & Disjoint Sets',
          topics: ['Union-Find with Path Compression', 'Segment Trees & Fenwick Trees', 'Trie & Suffix Automata'],
          completed: false,
          hours_allocated: 10
        }
      ],
      resources: [
        { title: 'DSA Complete Lecture Notes (PDF)', type: 'pdf', url: 'https://example.com/curriculum/dsa_notes.pdf' },
        { title: 'Tree Balancing Interactive Visualizer', type: 'link', url: 'https://visualgo.net/en/bst' },
        { title: 'Graph Theory Video Lectures Playlist', type: 'video', url: 'https://youtube.com/playlist?list=smartedu_dsa' }
      ]
    },
    {
      _id: 'cur_cs305',
      class_id: 'cls_cs305',
      subject_name: 'AI & Computer Vision Biometrics',
      syllabus: [
        {
          module_number: 1,
          title: 'Image Preprocessing & Spatial Filters',
          topics: ['Histogram Equalization & CLAHE', 'Gaussian & Bilateral Smoothing', 'Sobel & Canny Edge Detectors'],
          completed: true,
          hours_allocated: 8
        },
        {
          module_number: 2,
          title: 'Face Detection & Facial Landmark Extraction',
          topics: ['Haar Cascade Classifiers', 'HOG (Histogram of Oriented Gradients)', '68-point Dlib Facial Landmarks'],
          completed: true,
          hours_allocated: 10
        },
        {
          module_number: 3,
          title: 'Deep Face Embeddings & Biometric Verification',
          topics: ['Triplet Loss Architecture', '128-d Euclidean Face Embeddings', 'Cosine Similarity & Thresholding'],
          completed: false,
          hours_allocated: 12
        },
        {
          module_number: 4,
          title: 'Anti-Spoofing & Edge Microservices',
          topics: ['Liveness Detection & Blink Tracking', 'FastAPI & OpenCV Microservice Integration', 'Low-Light Anomaly Handling'],
          completed: false,
          hours_allocated: 10
        }
      ],
      resources: [
        { title: 'Face Recognition in Education: Research Whitepaper', type: 'pdf', url: 'https://example.com/papers/smart_attendance_slr.pdf' },
        { title: 'OpenCV CLAHE Microservice Repository', type: 'link', url: 'https://github.com/smartedu/opencv-face-service' },
        { title: 'Computer Vision Recorded Lecture 04', type: 'video', url: 'https://youtube.com/watch?v=smartedu_cv04' }
      ]
    }
  ];
}

export const mockDB = new MockDataStore();
