import { useState, useCallback } from "react";
import styles from "@/styles/Dropdown.module.css";

interface DropdownProps {
  title: string;
  options: string[];
}

export default function Dropdown({ title, options }: DropdownProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = useCallback((option: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  }, []);

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownButton} tabIndex={0}>
        <span className={styles.dropdownTitle}>{title}</span>
      </div>

      <div className={styles.dropdownMenu}>
        {options.map((option, index) => (
          <label key={index} className={styles.dropdownItem}>
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
