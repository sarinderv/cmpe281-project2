export const listAppointmentByPatient = /* GraphQL */ `
query listAppointmentByPatient($patientId: ID!) {
  listAppointments(filter: {patientId: {eq: $patientId}}) {
    items {
      id
      appointmentDate
      appointmentTime
      doctorId
      patientId
      doctor {
        firstName
        lastName
      }
    }
  }
}
`;

export const listAppointmentByDoctor = /* GraphQL */ `
query listAppointmentByDoctor($doctorId: ID!, $appointmentDate: String!) {
  listAppointments(filter: {doctorId: {eq: $doctorId}, appointmentDate: {eq: $appointmentDate}}) {
    items {
      id
      appointmentDate
      appointmentTime
      doctorId
      patientId
      patient {
        firstName
        lastName
        phone
      }
    }
  }
}
`;