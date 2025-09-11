package edu.ncsu.csc326.wolfcafe;

import java.time.LocalTime;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonSerializer;

/**
 * Class for handy utils shared across all of the API tests
 *
 * @author Kai Presler-Marshall
 *
 */
public class TestUtils {

    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter( LocalTime.class, (JsonSerializer<LocalTime>) ( src, typeOfSrc, context ) -> {
                return context.serialize( src.toString() );
            } ).registerTypeAdapter( LocalTime.class, (JsonDeserializer<LocalTime>) ( json, typeOfT, context ) -> {
                return LocalTime.parse( json.getAsString() );
            } ).create();

    public static String asJsonString ( final Object obj ) {
        return gson.toJson( obj ); // Serialize object to JSON using Gson
    }

}
