export const listAppointmentByPatient = /* GraphQL */ `
query listAppointmentByPatient($patientId: ID!,$appointmentDate: String!) {
  listAppointments(filter: {patientId: {eq: $patientId}, appointmentDate: {ge: $appointmentDate}}) {
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