แนวทางการพัฒนาโปรเจกต์ (Projects_Web Development Guideline)

  เอกสารนี้จัดทำขึ้นเพื่อให้ทีมพัฒนาทุกคนทำงานไปในทิศทางเดียวกัน มีมาตรฐาน และง่ายต่อการดูแลรักษาโปรเจกต์ในระยะยาว

  1. โครงสร้างไฟล์และคอมโพเนนต์ (File & Component Structure)

  เพื่อความเป็นระเบียบและง่ายต่อการค้นหาไฟล์

   * การตั้งชื่อไฟล์:
       * หน้า (Pages): ให้ยึดตามชื่อหน้าใน Figma แต่เปลี่ยนเป็นตัวพิมพ์เล็กทั้งหมด และใช้ขีด (-) คั่นระหว่างคำ เช่น หน้า "Customer
         Detail" ใน Figma จะกลายเป็นไฟล์ customer-detail.jsx
       * คอมโพเนนต์ (Components):
           * คอมโพเนนต์ทั่วไป (Reusable): ที่ใช้ซ้ำได้หลายที่ ให้ตั้งชื่อแบบ PascalCase เช่น Button.jsx, DataGrid.jsx
           * คอมโพเนนต์เฉพาะหน้า: ที่ใช้แค่ในหน้านั้นๆ ให้สร้างโฟลเดอร์ย่อยตามชื่อหน้านั้นๆ เพื่อเก็บคอมโพเนนต์เหล่านั้น
   * โครงสร้างโฟลเดอร์ (Folder Structure): แนะนำให้จัดโครงสร้างเบื้องต้นดังนี้

    1     /src
    2     |-- /api           # สำหรับจัดการการเชื่อมต่อ API ทั้งหมด
    3     |-- /assets        # เก็บไฟล์ static เช่น รูปภfont, icon
    4     |-- /components    # เก็บ UI Components ที่ใช้ซ้ำได้ทั่วทั้งโปรเจกต์
    5     |-- /hooks         # สำหรับ Custom Hooks ที่สร้างขึ้นเอง
    6     |-- /pages         # เก็บไฟล์ของแต่ละหน้า UI หลัก
    7     |   |-- home.jsx
    8     |   |-- customer-list.jsx
    9     |   `-- customer-detail.jsx
   10     |-- /services      # สำหรับจัดการ Business Logic ที่ซับซ้อน
   11     |-- /store         # สำหรับ State Management (เช่น Redux, Zustand)
   12     `-- /utils         # ฟังก์ชันช่วยเหลือเล็กๆ น้อยๆ ที่ใช้บ่อย

  2. การตั้งชื่อตัวแปรและฟังก์ชัน (Naming Conventions)

  ความสม่ำเสมอในการตั้งชื่อช่วยให้อ่านโค้ดเข้าใจได้ง่าย

   * ตัวแปรและฟังก์ชัน: ใช้แบบ camelCase และต้องสื่อความหมายชัดเจน
       * ดี: customerList, fetchUserData(), isLoading
       * ไม่ดี: list, data, getData(), flag
   * ค่าคงที่ (Constants): ใช้แบบ UPPER_SNAKE_CASE
       * ดี: MAX_LOGIN_ATTEMPTS, API_BASE_URL
   * Classes และ Components (React): ใช้แบบ PascalCase
       * ดี: class UserProfile, function DataGrid()

  3. การจัดการโค้ดและการทำงานร่วมกัน (Git Workflow)

  เพื่อป้องกันโค้ดหาย, ลดข้อขัดแย้ง (conflict) และตรวจสอบคุณภาพโค้ด

   1. แตก Branch ใหม่เสมอ: ห้ามทำงานบน Branch main หรือ develop โดยตรง
       * ตั้งชื่อ Branch ให้สื่อถึงสิ่งที่ทำ เช่น feature/add-login-page หรือ fix/customer-form-bug
   2. Commit อย่างสม่ำเสมอ: เมื่อทำงานเสร็จในส่วนเล็กๆ ให้ commit ทันที
       * เขียน Commit Message ให้ดี: ใช้รูปแบบ type: description
           * feat: Add customer search functionality (เพิ่มฟีเจอร์ใหม่)
           * fix: Correct calculation error in shopping cart (แก้ไขบั๊ก)
           * docs: Update development guideline (แก้ไขเอกสาร)
           * style: Format code with Prettier (ปรับสไตล์โค้ด ไม่กระทบ logic)
           * refactor: Improve performance of data fetching (ปรับปรุงโค้ดเดิม)
   3. Push Branch ขึ้น GitHub: เมื่อสิ้นสุดการทำงานในแต่ละวัน หรือเมื่อทำฟีเจอร์ย่อยเสร็จ ให้ push branch ของตัวเองขึ้นไป
       * git push origin feature/add-login-page
   4. เปิด Pull Request (PR): เมื่อทำงานใน Branch นั้นเสร็จสมบูรณ์และต้องการรวมเข้ากับ develop ให้เปิด PR
       * ในรายละเอียดของ PR ให้อธิบายว่าทำอะไรไปบ้าง, มีผลกระทบส่วนไหน, และแปะลิงก์ของ Task ใน Notion
   5. Code Review: ให้เพื่อนร่วมทีมอย่างน้อย 1 คนมาตรวจสอบโค้ด (review) และกด "Approve"
   6. Merge: เมื่อ PR ได้รับการ Approve แล้ว จึงค่อยทำการ Merge เข้า Branch develop

  4. การจัดการงานและการสื่อสาร (Task Management & Communication)

  เพื่อให้ทุกคนในทีมเห็นภาพรวมและสถานะของงานตรงกัน

   1. ก่อนเริ่มงาน:
       * หยิบ Task จาก Notion และ Assign ชื่อตัวเอง
       * ตรวจสอบว่าใน Task มีรายละเอียดครบถ้วน (เช่น ลิงก์ Figma, yêu cầu) หากไม่ชัดเจนให้สอบถามในกลุ่มทันที
   2. ระหว่างทำงาน:
       * ปฏิบัติตาม Git Workflow ที่กำหนดไว้
   3. หลังทำงานเสร็จ:
       * เปิด PR บน GitHub
       * อัปเดตสถานะใน Notion: ย้าย Task ไปยังคอลัมน์ "Ready for Review" หรือ "Done" พร้อมแปะลิงก์ PR ใน Task นั้นๆ
       * แจ้งในกลุ่ม: สรุปสั้นๆ เพื่อให้ทีมทราบ
           * ตัวอย่างการแจ้ง:
              > "ทำ Task 'หน้า Customer List' เสร็จแล้วครับ เปิด PR ไว้รอรีวิว [แปะลิงก์ PR ที่นี่] ใน Notion ติ๊กแล้วครับ"

  5. เครื่องมือและมาตรฐานโค้ด (Tooling & Code Standard)

  เพื่อบังคับให้โค้ดมีคุณภาพและรูปแบบเดียวกันทั้งโปรเจกต์โดยอัตโนมัติ

   * Linter/Formatter: ติดตั้งและใช้ ESLint และ Prettier ในโปรเจกต์ เพื่อจัดระเบียบโค้ด, ตรวจจับ error ง่ายๆ และบังคับใช้ style
      guide เดียวกัน (เช่น การใช้ single/double quote, การเว้นวรรค)

git test pull and test push