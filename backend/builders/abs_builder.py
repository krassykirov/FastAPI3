from abc import ABC, abstractmethod
from models import Item, User, Category, Laptop, Smartphone, Tablet, TV, Smartwatch
from sqlmodel import SQLModel
import decimal


class SQLModelBuilder(ABC):
    @abstractmethod
    def build(self) -> SQLModel:
        pass

class ItemBuilder(SQLModelBuilder):
    def __init__(self, item):
        self.item = item

    def set_name(self, name: str) -> None:
        self.item.name = name

    def set_price(self, price: decimal.Decimal) -> None:
        self.item.price = price

    def set_discount(self, discount: decimal.Decimal) -> None:
        if not discount:
            self.item.discount = 0.0
        else:
            self.item.discount = discount

    def set_category(self, category: Category) -> None:
        self.item.category = category

    def set_username(self, username: User) -> None:
        self.item.username = username

    def set_quantity(self, quantity: int) -> None:
        self.item.quantity = quantity

    def set_image(self, image: str) -> None:
        self.item.image = image

    def set_brand(self, brand) -> None:
        self.item.brand = brand

    def set_description(self, description: str) -> None:
        self.item.description = description

    def set_resolution(self, resolution: str) -> None:
        self.item.resolution = resolution

    def set_size(self, size: str) -> None:
            self.item.size = size

    def get_item(self) -> Item:
        return self.item

    def build(self) -> Item:
        return self.item

class LaptopBuilder(ItemBuilder):
    def __init__(self):
        super().__init__(Laptop())

    def set_processor(self, processor: str) -> None:
        self.item.processor = processor

    def set_ram(self, ram: str) -> None:
        self.item.ram = ram

    def set_storage(self, storage: str) -> None:
        self.item.storage = storage

class SmartphoneBuilder(ItemBuilder):
    def __init__(self):
        super().__init__(Smartphone())

    def set_processor(self, processor: str) -> None:
        self.item.processor = processor

    def set_ram(self, ram: str) -> None:
        self.item.ram = ram

    def set_storage(self, storage: str) -> None:
        self.item.storage = storage

class TabletBuilder(ItemBuilder):
    def __init__(self):
        super().__init__(Tablet())

    def set_processor(self, processor: str) -> None:
        self.item.processor = processor

    def set_ram(self, ram: str) -> None:
        self.item.ram = ram

    def set_storage(self, storage: str) -> None:
        self.item.storage = storage

class SmartwatchBuilder(ItemBuilder):
    def __init__(self):
        super().__init__(Smartwatch())

    def set_processor(self, processor: str) -> None:
        self.item.processor = processor

    def set_ram(self, ram: str) -> None:
        self.item.ram = ram

class TvBuilder(ItemBuilder):
    def __init__(self):
        super().__init__(TV())

    def set_display_size(self, display_size: str) -> None:
        self.item.display_size = display_size

    def set_is_smart(self, is_smart: bool) -> None:
        self.item.is_smart = is_smart
