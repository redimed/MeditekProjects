package patient.telehealth.redimed.workinjury.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by LamNguyen on 12/21/2015.
 */
public class ClinicalDetails {

    @SerializedName("Category")
    private String category;

    @SerializedName("FileUploads")
    private FileUpload[] fileUpload;

    public FileUpload[] getFileUpload() {
        return fileUpload;
    }

    public void setFileUpload(FileUpload[] fileUpload) {
        this.fileUpload = fileUpload;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
