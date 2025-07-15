import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.*;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import org.json.JSONArray;
import org.json.JSONObject;

public class RunSolution {
    public static void main(String[] args) throws Exception {
        // Step 1: Read user_code.java
        String userCode = Files.readString(Path.of("user_code.java"));

        // Step 2: Read function name
        String functionName = Files.readString(Path.of("function_name.txt")).trim();

        // Step 3: Save user_code.java (optional - already exists)
        // Files.write(Path.of("UserCode.java"), userCode.getBytes());

        // Step 4: Compile user_code.java
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler.run(null, null, null, "user_code.java") != 0) {
            throw new RuntimeException("Compilation failed");
        }

        // Step 5: Load compiled class
        Class<?> userClass = Class.forName("UserCode");

        // Step 6: Parse input args from command line
        JSONArray inputJson = new JSONArray(args[0]);
        Object[] javaArgs = new Object[inputJson.length()];
        Class<?>[] paramTypes = new Class<?>[inputJson.length()];

        for (int i = 0; i < inputJson.length(); i++) {
            Object val = inputJson.get(i);
            if (val instanceof Integer) {
                javaArgs[i] = ((Integer) val).intValue();
                paramTypes[i] = int.class;
            } else if (val instanceof Double) {
                javaArgs[i] = ((Double) val).doubleValue();
                paramTypes[i] = double.class;
            } else if (val instanceof Boolean) {
                javaArgs[i] = ((Boolean) val).booleanValue();
                paramTypes[i] = boolean.class;
            } else if (val instanceof String) {
                javaArgs[i] = val;
                paramTypes[i] = String.class;
            } else {
                throw new IllegalArgumentException("Unsupported input type: " + val);
            }
        }

        // Step 7: Reflectively call the method
        Method method = userClass.getMethod(functionName, paramTypes);
        Object result = method.invoke(null, javaArgs);

        // Step 8: Print the result as JSON
        JSONObject output = new JSONObject();
        output.put("result", result);
        System.out.println(output.toString());
    }
}