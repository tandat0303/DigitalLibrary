const API_BASE = `${import.meta.env.VITE_API_URL}/data`;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  data?: any;
  headers?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", data, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: { ...headers },
  };

  if (data) {
    const contentType = headers["Content-Type"];

    if (contentType === "application/x-www-form-urlencoded") {
      const formData = new URLSearchParams();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      config.body = formData.toString();
    } else {
      config.headers = {
        "Content-Type": "application/json",
        ...headers,
      };
      config.body = JSON.stringify(data);
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}
