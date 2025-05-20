import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

export default function Index() {
  const [formData, setFormData] = useState({
    ibadah: "",
    jenis: "",
    waktu: "",
  });

  const [dataIbadah, setDataIbadah] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getIbadah = async () => {
    try {
      const response = await fetch(
        "https://8052-66-96-228-86.ngrok-free.app/api/ibadah"
      );
      const data = await response.json();
      setDataIbadah(data);
    } catch (error) {
      console.error("Gagal mengambil data ibadah:", error);
      Alert.alert("Error", "Gagal mengambil data ibadah");
    }
  };

  const handleSubmit = async () => {
    if (!formData.ibadah || !formData.jenis || !formData.waktu) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    try {
      const url = editId
        ? `https://8052-66-96-228-86.ngrok-free.app/api/ibadah/${editId}`
        : "https://8052-66-96-228-86.ngrok-free.app/api/ibadah";

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ ibadah: "", jenis: "", waktu: "" });
        setEditId(null);
        getIbadah();
        Alert.alert("Berhasil", `Data ibadah berhasil ${editId ? "diedit" : "ditambahkan"}.`);
      } else {
        throw new Error("Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Gagal submit data ibadah:", error);
      Alert.alert("Error", "Gagal menyimpan data ibadah");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      Alert.alert(
        "Konfirmasi",
        "Apakah Anda yakin ingin menghapus data ini?",
        [
          {
            text: "Batal",
            style: "cancel"
          },
          {
            text: "Hapus",
            onPress: async () => {
              const response = await fetch(`https://8052-66-96-228-86.ngrok-free.app/api/ibadah/${id}`, {
                method: "DELETE",
              });
              
              if (response.ok) {
                getIbadah();
                Alert.alert("Berhasil", "Data ibadah berhasil dihapus.");
              } else {
                throw new Error("Gagal menghapus data");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Gagal hapus data ibadah:", error);
      Alert.alert("Error", "Gagal menghapus data ibadah");
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      ibadah: item.ibadah,
      jenis: item.jenis,
      waktu: item.waktu,
    });
    setEditId(item.id);
    Alert.alert("Info", "Silakan edit data pada form di atas");
  };

  useEffect(() => {
    getIbadah();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#d1fae5]`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        <Text style={tw`text-3xl font-bold text-[#065f46] mb-6 text-center`}>
          🕌 Ibadah Yuk!
        </Text>

        {/* Form Input */}
        <View style={tw`bg-white p-5 rounded-2xl shadow-md border border-yellow-400 mb-8`}>
          <Text style={tw`text-xl font-bold text-yellow-600 mb-4`}>
            ✨ {editId ? "Edit Ibadah" : "Tambah Pahala"}
          </Text>

          <TextInput
            style={tw`bg-white border border-yellow-400 rounded-xl p-3 mb-4 text-gray-800 shadow-sm`}
            value={formData.ibadah}
            onChangeText={(value) => handleChange("ibadah", value)}
            placeholder="Contoh: Shalat Magrib"
            placeholderTextColor="#9ca3af"
          />

          <TextInput
            style={tw`bg-white border border-yellow-400 rounded-xl p-3 mb-4 text-gray-800 shadow-sm`}
            value={formData.jenis}
            onChangeText={(value) => handleChange("jenis", value)}
            placeholder="Jenis Ibadah (Wajib / Sunnah)"
            placeholderTextColor="#9ca3af"
          />

          {/* Date Picker */}
          <TouchableOpacity
            style={tw`bg-white border border-yellow-400 rounded-xl p-3 mb-5 shadow-sm`}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={tw`text-gray-700`}>
              {formData.waktu
                ? new Date(formData.waktu).toLocaleDateString()
                : "Pilih Tanggal Ibadah"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.waktu ? new Date(formData.waktu) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const isoDate = selectedDate.toISOString().split("T")[0];
                  handleChange("waktu", isoDate);
                }
              }}
            />
          )}

          <TouchableOpacity
            style={tw`bg-[#15803d] py-3 rounded-xl mt-4`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-white text-center text-base font-semibold`}>
              {editId ? "Simpan Perubahan" : "Tambah Pahala"}
            </Text>
          </TouchableOpacity>

          {editId && (
            <TouchableOpacity
              style={tw`bg-gray-500 py-3 rounded-xl mt-3`}
              onPress={() => {
                setFormData({ ibadah: "", jenis: "", waktu: "" });
                setEditId(null);
              }}
            >
              <Text style={tw`text-white text-center text-base font-semibold`}>
                Batal Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List Data Ibadah */}
        <Text style={tw`text-xl font-bold text-yellow-700 mb-4`}>
          🌙 Ayo Kerjakan Ibadahmu!
        </Text>

        {dataIbadah.map((item: any, index: number) => (
          <View
            key={item.id || index}
            style={tw`bg-white rounded-xl shadow-md mb-4 p-4 border border-yellow-200`}
          >
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-lg font-bold text-yellow-800`}>{item.ibadah}</Text>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={tw`bg-yellow-400 px-3 py-1 rounded-full`}
                >
                  <Text style={tw`text-white`}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={tw`bg-red-500 px-3 py-1 rounded-full`}
                >
                  <Text style={tw`text-white`}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={tw`flex-row items-center mb-1`}>
              <Text style={tw`text-gray-600 font-medium`}>Jenis: </Text>
              <Text style={tw`text-gray-800`}>{item.jenis}</Text>
            </View>
            
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-600 font-medium`}>Waktu: </Text>
              <Text style={tw`text-gray-800`}>
                {new Date(item.waktu).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}