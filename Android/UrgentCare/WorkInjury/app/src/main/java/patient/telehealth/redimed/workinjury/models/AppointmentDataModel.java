package patient.telehealth.redimed.workinjury.models;

/**
 * Created by phanq on 04/15/2016.
 */
public class AppointmentDataModel {
    private String Name;
    private String Type;
    private String Category;
    private String Section;
    private String Value;

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getCategory() {
        return Category;
    }

    public void setCategory(String category) {
        Category = category;
    }

    public String getSection() {
        return Section;
    }

    public void setSection(String section) {
        Section = section;
    }

    public String getValue() {
        return Value;
    }

    public void setValue(String value) {
        Value = value;
    }
}
