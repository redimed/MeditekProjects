package fox.telehealthmeditek.util;

import android.content.Context;
import android.graphics.Typeface;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Fox on 9/21/2015.
 */
public class FontUtils {

    public static interface FontTypes {
        public static String LIGHT = "Light";
        public static String BOLD = "Bold";
    }

    private static Map fontMap = new HashMap();

    static {
        fontMap.put(FontTypes.LIGHT, "fonts/Roboto-Light.ttf");
        fontMap.put(FontTypes.BOLD, "fonts/Roboto-Bold.ttf");
    }

    private static Map typefaceCache = new HashMap();

    private static Object getRobotoTypeface(Context context, String fontType) {
        String fontPath = (String) fontMap.get(fontType);
        if (!typefaceCache.containsKey(fontType)) {
            typefaceCache.put(fontType, Typeface.createFromAsset(context.getAssets(), fontPath));
        }
        return typefaceCache.get(fontType);
    }

    private static Typeface getRobotoTypeface(Context context, Typeface originalTypeface) {
        String robotoFontType = FontTypes.LIGHT; //default Light Roboto font
        if (originalTypeface != null) {
            int style = originalTypeface.getStyle();
            switch (style) {
                case Typeface.BOLD:
                    robotoFontType = FontTypes.BOLD;
            }
        }
        return (Typeface) getRobotoTypeface(context, robotoFontType);
    }

    public static void setRobotoFont(Context context, View view)
    {
        if (view instanceof ViewGroup)
        {
            for (int i = 0; i < ((ViewGroup)view).getChildCount(); i++)
            {
                setRobotoFont(context, ((ViewGroup)view).getChildAt(i));
            }
        }
        else if (view instanceof TextView)
        {
            Typeface currentTypeface = ((TextView) view).getTypeface();
            ((TextView) view).setTypeface(getRobotoTypeface(context, currentTypeface));
        }
    }
}
