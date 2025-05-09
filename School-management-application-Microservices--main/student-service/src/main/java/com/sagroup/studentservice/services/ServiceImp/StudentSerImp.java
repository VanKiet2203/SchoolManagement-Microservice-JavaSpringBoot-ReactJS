package com.sagroup.studentservice.services.ServiceImp;

import com.sagroup.studentservice.domains.Student;
import com.sagroup.studentservice.dto.NewUserRequest;
import com.sagroup.studentservice.repositories.StudentRepo;
import com.sagroup.studentservice.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.persistence.PostLoad;
import javax.persistence.Transient;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentSerImp implements StudentService {

    @Autowired
    private StudentRepo studentRepo;
    @Autowired
    private RestTemplate restTemplate;

    private String getAuthToken() {
        try {
            String loginUrl = "http://localhost:8089/api/users/auth/login";
            Map<String, String> loginRequest = Map.of(
                "username", "admin",
                "password", "123456"
            );
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                loginUrl,
                loginRequest,
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("token");
            }
            throw new RuntimeException("Failed to get authentication token");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get authentication token: " + e.getMessage());
        }
    }

    @Override
    public Optional<Student> getById(Long id){
        return studentRepo.findById(id);
    }

    @Override
    public Student addStudent(Student student) {
        if (student != null) {
            assignAcademicPerformance(student);
            Student savedStudent = studentRepo.save(student);

            // Create user account in user-service
            NewUserRequest userRequest = new NewUserRequest(
                student.getEmail(),
                "STUDENT",
                "123456" // Default password, should be changed on first login
            );

            try {
                String userServiceUrl = "http://localhost:8089/api/users/create";
                
                // Create headers with authentication
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(getAuthToken());

                HttpEntity<NewUserRequest> requestEntity = new HttpEntity<>(userRequest, headers);
                
                ResponseEntity<String> response = restTemplate.exchange(
                    userServiceUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
                );

                if (!response.getStatusCode().is2xxSuccessful()) {
                    // If user creation fails, delete the student
                    studentRepo.delete(savedStudent);
                    throw new RuntimeException("Failed to create user account: " + response.getBody());
                }
            } catch (Exception e) {
                // If user creation fails, delete the student
                studentRepo.delete(savedStudent);
                throw new RuntimeException("Failed to create user account: " + e.getMessage());
            }

            return savedStudent;
        }
        return null;
    }





    @Override
    public Student update(Long id, Student student) {
        Student repoStudent = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        repoStudent.setFirstName(student.getFirstName());
        repoStudent.setLastName(student.getLastName());
        repoStudent.setMathScore(student.getMathScore());
        repoStudent.setPhysicsScore(student.getPhysicsScore());
        repoStudent.setChemistryScore(student.getChemistryScore());
        repoStudent.setLiteratureScore(student.getLiteratureScore());
        repoStudent.setEnglishScore(student.getEnglishScore());
        repoStudent.setBehaviorScore(student.getBehaviorScore());
        repoStudent.setClassName(student.getClassName());

        assignAcademicPerformance(repoStudent);

        return studentRepo.save(repoStudent);
    }

    @Override
    public List<Student> getByClassName(String className) {
        List<Student> students = studentRepo.findByClassName(className);

        for (Student student : students) {
            assignAcademicPerformance(student); // Gán học lực trước khi trả về
        }

        return students;
    }



    @Override
    public void removeById(Long id) {
        studentRepo.deleteById(id);
    }


    @Override
    public List<Student> getAllStudents() {
        List<Student> students = studentRepo.findAll();
        students.forEach(this::assignAcademicPerformance);
        return students;
    }


    private void assignAcademicPerformance(Student student) {
        System.out.println("Tính học lực cho student: " + student.getFirstName() + " " + student.getLastName());

        double total = 0;
        int count = 0;

        if (student.getMathScore() != null) {
            total += student.getMathScore();
            count++;
        }
        if (student.getPhysicsScore() != null) {
            total += student.getPhysicsScore();
            count++;
        }
        if (student.getChemistryScore() != null) {
            total += student.getChemistryScore();
            count++;
        }
        if (student.getLiteratureScore() != null) {
            total += student.getLiteratureScore();
            count++;
        }
        if (student.getEnglishScore() != null) {
            total += student.getEnglishScore();
            count++;
        }

        double avg = count > 0 ? total / count : 0;

        String performance;
        if (avg >= 8.0) performance = "Giỏi";
        else if (avg >= 6.5) performance = "Khá";
        else if (avg >= 5.0) performance = "Trung Bình";
        else performance = "Yếu";

        System.out.println("AVG = " + avg + ", Performance = " + performance);

        student.setAcademicPerformance(performance);
    }


    @Override
    public Map<String, Map<String, Long>> getPerformanceStatisticsByClass() {
        List<Student> all = studentRepo.findAll();

        return all.stream()
                .collect(Collectors.groupingBy(
                        Student::getClassName,
                        Collectors.groupingBy(
                                Student::getAcademicPerformance,
                                Collectors.counting()
                        )
                ));
    }


}
