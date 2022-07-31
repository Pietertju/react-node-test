from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.support import expected_conditions
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

import time

def log_in_and_mail(email, password):
    c = webdriver.ChromeOptions()
    c.add_argument("--incognito")

    print("preload")

    driver = webdriver.Chrome(ChromeDriverManager().install(), options=c)
    driver.get("https://login.microsoftonline.com/")

    driver.implicitly_wait(1)
    print("loaded")

    elem = driver.find_element(By.CSS_SELECTOR, "#i0116")
    elem.send_keys(email)

    driver.implicitly_wait(1)
    print("typed email")

    elem1 = driver.find_element(By.CSS_SELECTOR, "#idSIButton9")
    elem1.click()

    driver.implicitly_wait(1)
    print("clickedemail")

    elem2 = driver.find_element(By.CSS_SELECTOR, "#i0118")
    elem2.send_keys(password)

    print("typed password")

    time.sleep(3)

    elem3 = driver.find_element(By.CSS_SELECTOR, "#idSIButton9")
    elem3.click()

    print("clicked password")

    wait = WebDriverWait(driver, 60);
    wait.until(expected_conditions.url_contains("SAS/ProcessAuth"))

    elem4 = driver.find_element(By.CSS_SELECTOR, "#idSIButton9")
    elem4.click()

    wait2 = WebDriverWait(driver, 10);
    wait2.until(expected_conditions.url_contains("office.com"))

    print("POGGERS")

    driver.get("https://outlook.office.com/mail/")

    print("opening mail xd")

    wait3 = WebDriverWait(driver, 10);
    wait3.until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, "button[data-automation-type='RibbonSplitButton']")))

    time.sleep(2)
    print("element loaded I think")

    elem5 = driver.find_element(By.CSS_SELECTOR, "button[data-automation-type='RibbonSplitButton']")
    elem5.click()

    print("creating new mail")

    wait4 = WebDriverWait(driver, 10);
    wait4.until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, "button[title='Send (Ctrl+Enter)']")))

    print("template ccreated")

    elem6 = driver.find_element(By.CSS_SELECTOR, "div[aria-label='To']")
    elem6.send_keys("pieter.ebbers99@gmail.com")

    elem7 = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Add a subject']")
    elem7.send_keys("Email via fakelogin hack")

    elem8 = driver.find_element(By.CSS_SELECTOR, "div[aria-label='Message body, press Alt+F10 to exit']")
    elem8.send_keys("Body van de email")

    elem9 = driver.find_element(By.CSS_SELECTOR, "button[title='Send (Ctrl+Enter)']")
    elem9.click()

    print("send email")

    time.sleep(3)

    driver.quit()

    print("Finished!")

email = "pebbers@anago.nl"
password = "test"

log_in_and_mail(email, password)