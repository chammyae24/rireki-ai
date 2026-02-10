import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { RirekishoData } from "@/types/resume";
import { convertToJapaneseDate } from "@/lib/fonts/helpers";
import { registerFonts as loadFonts } from "@/lib/fonts/registry";

// Register fonts on component load
loadFonts();

// A4 size in points: 595.28 x 841.89
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    padding: 30,
    fontSize: 10,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    borderLeftWidth: 1,
    borderLeftColor: "#000",
    borderLeftStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    // Top border is usually handled by the previous section or container
  },
  // We'll use a more complex grid approach for the actual JIS layout later.
  // For Phase 1, we focus on getting the data on the page with Japanese fonts.

  header: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 20,
    alignItems: "center",
  },
  colLabel: {
    width: "20%",
    backgroundColor: "#f0f0f0",
    padding: 2,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    height: "100%",
    justifyContent: "center",
  },
  colValue: {
    width: "80%",
    padding: 2,
    fontSize: 10,
  },

  // Basic container for now
  container: {
    border: "1 solid #000",
  },
});

interface RirekishoDocumentProps {
  data: RirekishoData;
}

export const RirekishoDocument = ({ data }: RirekishoDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>履歴書</Text>
        <Text style={{ textAlign: "right", fontSize: 9, marginBottom: 5 }}>
          {convertToJapaneseDate(new Date())} 現在
        </Text>

        <View style={styles.container}>
          {/* Personal Info */}
          <View style={styles.row}>
            <View style={styles.colLabel}>
              <Text>氏名</Text>
            </View>
            <View style={styles.colValue}>
              <Text>{data.personalInfo.fullName}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.colLabel}>
              <Text>フリガナ</Text>
            </View>
            <View style={styles.colValue}>
              <Text>{data.personalInfo.katakanaName}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.colLabel}>
              <Text>生年月日</Text>
            </View>
            <View style={styles.colValue}>
              <Text>{data.personalInfo.birthDate}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.colLabel}>
              <Text>性別</Text>
            </View>
            <View style={styles.colValue}>
              <Text>{data.personalInfo.gender === "Male" ? "男" : "女"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.colLabel}>
              <Text>住所</Text>
            </View>
            <View style={styles.colValue}>
              <Text>{data.personalInfo.currentAddress}</Text>
            </View>
          </View>

          {/* Education & Work History Header */}
          <View
            style={[
              styles.row,
              {
                marginTop: 10,
                backgroundColor: "#f0f0f0",
                justifyContent: "center",
              },
            ]}
          >
            <Text>学歴・職歴</Text>
          </View>

          {/* Education */}
          <View style={styles.row}>
            <Text
              style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}
            >
              学歴
            </Text>
          </View>
          {data.education.map((edu, index) => (
            <View key={`edu-${index}`} style={styles.row}>
              <View style={[styles.colValue, { width: "20%" }]}>
                <Text>{edu.startDate ? edu.startDate : ""}</Text>
              </View>
              <View style={[styles.colValue, { width: "10%" }]}>
                <Text></Text>
              </View>
              <View style={[styles.colValue, { width: "70%" }]}>
                <Text>
                  {edu.schoolName}{" "}
                  {edu.status === "Graduated" ? "卒業" : "中退"}
                </Text>
              </View>
            </View>
          ))}

          {/* Work History */}
          <View style={styles.row}>
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              職歴
            </Text>
          </View>
          {data.workHistory.map((work, index) => (
            <View key={`work-${index}`} style={styles.row}>
              <View style={[styles.colValue, { width: "20%" }]}>
                <Text>{work.startDate ? work.startDate : ""}</Text>
              </View>
              <View style={[styles.colValue, { width: "10%" }]}>
                <Text></Text>
              </View>
              <View style={[styles.colValue, { width: "70%" }]}>
                <Text>{work.companyName} 入社</Text>
              </View>
            </View>
          ))}
          <View style={styles.row}>
            <View
              style={[styles.colValue, { width: "100%", textAlign: "right" }]}
            >
              <Text>以上</Text>
            </View>
          </View>

          {/* Motivation */}
          <View style={[styles.row, { marginTop: 10, borderBottom: 0 }]}>
            <View
              style={[
                styles.colLabel,
                { borderBottom: 1, borderBottomColor: "#000" },
              ]}
            >
              <Text>志望動機</Text>
            </View>
            <View
              style={[
                styles.colValue,
                { borderBottom: 1, borderBottomColor: "#000" },
              ]}
            >
              <Text>{data.motivation.reasonForApplying}</Text>
            </View>
          </View>

          {/* Self-PR */}
          <View style={[styles.row, { borderBottom: 0 }]}>
            <View
              style={[
                styles.colLabel,
                { borderBottom: 1, borderBottomColor: "#000" },
              ]}
            >
              <Text>自己PR</Text>
            </View>
            <View
              style={[
                styles.colValue,
                { borderBottom: 1, borderBottomColor: "#000" },
              ]}
            >
              <Text>{data.motivation.selfPR}</Text>
            </View>
          </View>

          {/* Skills */}
          <View style={[styles.row, { borderBottom: 0 }]}>
            <View
              style={[
                styles.colLabel,
                { borderBottom: 1, borderBottomColor: "#000" },
              ]}
            >
              <Text>技能・資格</Text>
            </View>
            <View
              style={[
                styles.colValue,
                { borderBottom: 1, borderBottomColor: "#000" },
              ]}
            >
              {data.skills.jlptLevel && (
                <Text style={{ marginBottom: 2 }}>
                  日本語能力試験: {data.skills.jlptLevel}
                </Text>
              )}
              {data.skills.technicalSkills &&
                data.skills.technicalSkills.length > 0 && (
                  <Text style={{ marginBottom: 2 }}>
                    技術スキル: {data.skills.technicalSkills.join(", ")}
                  </Text>
                )}
              {data.skills.sswCertificates &&
                data.skills.sswCertificates.length > 0 && (
                  <Text style={{ marginBottom: 2 }}>
                    SSW資格: {data.skills.sswCertificates.join(", ")}
                  </Text>
                )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
