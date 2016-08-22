package patient.telehealth.redimed.workinjury.model;

import android.os.Parcel;
import android.os.Parcelable;

public class CustomGallery implements Parcelable {

	public String sdcardPath;
	public boolean isSelected = false;

	public CustomGallery() {
	}

	protected CustomGallery(Parcel in) {
		sdcardPath = in.readString();
		isSelected = in.readByte() != 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		dest.writeString(sdcardPath);
		dest.writeByte((byte) (isSelected ? 1 : 0));
	}

	@Override
	public int describeContents() {
		return 0;
	}

	public static final Creator<CustomGallery> CREATOR = new Creator<CustomGallery>() {
		@Override
		public CustomGallery createFromParcel(Parcel in) {
			return new CustomGallery(in);
		}

		@Override
		public CustomGallery[] newArray(int size) {
			return new CustomGallery[size];
		}
	};
}
