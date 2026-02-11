import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { RirekishoData } from "@/types/resume";
import { registerFonts as loadFonts } from "@/lib/fonts/registry";

loadFonts();

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    padding: 30,
    fontSize: 10,
    lineHeight: 1.4,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: 700,
    textDecoration: "underline",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: "#e5e7eb",
    padding: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#374151",
    borderLeftStyle: "solid",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 140,
    fontWeight: 700,
    fontSize: 9,
    color: "#374151",
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#9ca3af",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#9ca3af",
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    fontSize: 9,
    justifyContent: "center",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  photoContainer: {
    position: "absolute",
    top: 30,
    right: 30,
    width: 90,
    height: 120,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  photoText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export const BioDataDocument = ({ data }: { data: RirekishoData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BIO-DATA</Text>

        {/* Photo Placeholder */}
        <View style={styles.photoContainer}>
          {/* Ideally we would render an Image component here if data.personalInfo.photoUrl exists */}
          <Text style={styles.photoText}>PHOTO</Text>
        </View>

        {/* 1. Personal Details */}
        <View style={[styles.section, { paddingRight: 100 }]}>
          <Text style={styles.sectionTitle}>1. PERSONAL DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{data.personalInfo.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Katakana Name:</Text>
            <Text style={styles.value}>{data.personalInfo.katakanaName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{data.personalInfo.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{data.personalInfo.birthDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Current Address:</Text>
            <Text style={styles.value}>{data.personalInfo.currentAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{data.personalInfo.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{data.personalInfo.phone}</Text>
          </View>

          {data.personalInfo.physicalStats && (
            <>
              <View style={[styles.row, { marginTop: 5 }]}>
                <Text style={styles.label}>Height / Weight:</Text>
                <Text style={styles.value}>
                  {data.personalInfo.physicalStats.heightCm} cm /{" "}
                  {data.personalInfo.physicalStats.weightKg} kg
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Blood Type:</Text>
                <Text style={styles.value}>
                  {data.personalInfo.physicalStats.bloodType || "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Dominant Hand:</Text>
                <Text style={styles.value}>
                  {data.personalInfo.physicalStats.handz}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* 2. Family Details */}
        {data.personalInfo.familyDetails &&
          data.personalInfo.familyDetails.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. FAMILY DETAILS</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, { width: "20%" }]}>
                    Relationship
                  </Text>
                  <Text style={[styles.tableCell, { width: "40%" }]}>Name</Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>Age</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: "30%" },
                      styles.lastCell,
                    ]}
                  >
                    Occupation
                  </Text>
                </View>
                {data.personalInfo.familyDetails.map((f, i) => (
                  <View key={i} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: "20%" }]}>
                      {f.relationship}
                    </Text>
                    <Text style={[styles.tableCell, { width: "40%" }]}>
                      {f.name}
                    </Text>
                    <Text style={[styles.tableCell, { width: "10%" }]}>
                      {f.age}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { width: "30%" },
                        styles.lastCell,
                      ]}
                    >
                      {f.occupation}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* 3. Education Background */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. EDUCATIONAL BACKGROUND</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: "20%" }]}>Period</Text>
              <Text style={[styles.tableCell, { width: "60%" }]}>
                School Name
              </Text>
              <Text
                style={[styles.tableCell, { width: "20%" }, styles.lastCell]}
              >
                Status
              </Text>
            </View>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {edu.startDate} - {edu.endDate}
                </Text>
                <Text style={[styles.tableCell, { width: "60%" }]}>
                  {edu.schoolName}
                </Text>
                <Text
                  style={[styles.tableCell, { width: "20%" }, styles.lastCell]}
                >
                  {edu.status}
                </Text>
              </View>
            ))}
            {data.education.length === 0 && (
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "100%", textAlign: "center", padding: 10 },
                    styles.lastCell,
                  ]}
                >
                  No education history provided.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 4. Employment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. EMPLOYMENT HISTORY</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: "20%" }]}>Period</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>Company</Text>
              <Text
                style={[styles.tableCell, { width: "50%" }, styles.lastCell]}
              >
                Role & Description
              </Text>
            </View>
            {data.workHistory.map((work, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {work.startDate} - {work.endDate}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {work.companyName}
                </Text>
                <Text
                  style={[styles.tableCell, { width: "50%" }, styles.lastCell]}
                >
                  {work.role}
                  {work.description ? `\n${work.description}` : ""}
                </Text>
              </View>
            ))}
            {data.workHistory.length === 0 && (
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "100%", textAlign: "center", padding: 10 },
                    styles.lastCell,
                  ]}
                >
                  No work history provided.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 5. Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. SKILLS & QUALIFICATIONS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Japanese Level:</Text>
            <Text style={styles.value}>{data.skills.jlptLevel || "None"}</Text>
          </View>
          {data.skills.sswCertificates &&
            data.skills.sswCertificates.length > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>SSW Certificates:</Text>
                <Text style={styles.value}>
                  {data.skills.sswCertificates.join(", ")}
                </Text>
              </View>
            )}
          {data.skills.technicalSkills &&
            data.skills.technicalSkills.length > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Technical Skills:</Text>
                <Text style={styles.value}>
                  {data.skills.technicalSkills.join(", ")}
                </Text>
              </View>
            )}
        </View>
      </Page>
    </Document>
  );
};
