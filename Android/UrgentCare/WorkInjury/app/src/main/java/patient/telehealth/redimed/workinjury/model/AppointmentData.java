package patient.telehealth.redimed.workinjury.model;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Fox on 3/7/2016.
 */
public class AppointmentData {

    @SerializedName("Section")
    private String Section;

    @SerializedName("Category")
    private String Category;

    @SerializedName("Type")
    private String Type;

    @SerializedName("Name")
    private String Name;

    @SerializedName("Value")
    private String Value;

    public String getSection() {
        return Section;
    }

    public void setSection(String section) {
        Section = section;
    }

    public String getCategory() {
        return Category;
    }

    public void setCategory(String category) {
        Category = category;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getValue() {
        return Value;
    }

    public void setValue(String value) {
        Value = value;
    }
}
